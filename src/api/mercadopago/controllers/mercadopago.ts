import axios from 'axios';

export default {
  async webhook(ctx) {
    try {
      const { id, topic, type, data } = ctx.request.body;

      if ((topic || type) !== 'payment') {
        return ctx.send({ message: 'No es un evento de pago' });
      }

      const paymentId = data?.id;
      if (!paymentId) {
        return ctx.badRequest('Falta payment ID');
      }

      const { data: payment } = await axios.get(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );

      const orderId = payment.external_reference;
      const status = payment.status;

      await strapi.entityService.update('api::order.order', orderId, {
        data: { condition: status },
      });

      ctx.send({ success: true });
    } catch (err) {
      console.error("Error en webhook MP:", err);
      ctx.status = 500;
      ctx.body = { error: 'Error interno' };
    }
  }
};
