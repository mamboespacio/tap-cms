import { factories } from "@strapi/strapi";
import axios from "axios";
import type { OrderEntity } from "../../../../types/entities"; // Asegúrate de que la ruta sea correcta


export default factories.createCoreController("api::order.order", ({ strapi }) => ({

  async create(ctx) {
    const user = ctx.state.user;

    if (!user) return ctx.unauthorized("Debes estar autenticado");

    // inyectar user.id en el body
    ctx.request.body.data = {
      ...ctx.request.body.data,
      users_permissions_user: user.id,
    };

    // delegar al controller original
    const response = await super.create(ctx);
    return response;
  },

  async startPayment(ctx) {
    console.log("✅ startPayment ejecutado");

    const { orderId } = ctx.request.body;
    const requester = ctx.state.user;
    console.log("ctx.state.user:", requester);

    if (!requester) return ctx.unauthorized("Debes estar autenticado.");
    if (!orderId) return ctx.badRequest("Falta el orderId");


    const order = await strapi.entityService.findOne("api::order.order", orderId, {
      populate: {
        users_permissions_user: true,
        products: {
          populate: ["product"],
        },
      },
    }) as unknown as OrderEntity;

    const items = order.products.map((op: any) => ({
      title: op.product?.name || "Producto sin nombre",
      quantity: op.quantity,
      currency_id: "ARS",
      unit_price: parseFloat(op.product?.price || 0),
    }));

    if (!order) return ctx.notFound("Orden no encontrada.");

    const orderUser = (order as any).users_permissions_user;
    if (!orderUser || orderUser.id !== requester.id) {
      return ctx.forbidden("No tienes permiso para iniciar el pago de esta orden.");
    }

    const external_reference = order.external_reference || `order_${orderId}`;

    if (!order.external_reference) {
      await strapi.entityService.update("api::order.order", orderId, {
        data: { external_reference },
      });
    }

    try {
      const mpResponse = await axios.post(
        "https://api.mercadopago.com/checkout/preferences",
        {
          items,
          external_reference,
          notification_url: `${process.env.BACKEND_URL}/webhooks/mercadopago`,
          back_urls: {
            success: `${process.env.FRONTEND_URL}/success`,
            failure: `${process.env.FRONTEND_URL}/failure`,
            pending: `${process.env.FRONTEND_URL}/pending`,
          },
          auto_return: "approved",

          payer: {
            name: "Juan",
            surname: "Pérez",
            email: "test_user_779195160@testuser.com",
            identification: {
              type: "DNI",
              number: "12345678"
            }
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      const mpUrl = mpResponse.data.init_point;

      await strapi.entityService.update("api::order.order", orderId, {
        data: {
          // @ts-expect-error: mp_url aún no tipado
          mp_url: mpUrl,
        },
      });

      ctx.send({ mp_url: mpUrl });
    } catch (err) {
      console.error("Error al crear preferencia MP:", err.response?.data || err.message);
      return ctx.internalServerError("Error al crear preferencia de pago.");
    }
  },
}));
