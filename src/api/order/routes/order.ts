export default {
    routes: [
        // 🧾 Ruta custom
        {
            method: "POST",
            path: "/orders/start-payment",
            handler: "order.startPayment",
            config: {
                auth: { scope: [] },
            },
        },

        // ✅ Rutas estándar (restauradas)
        {
            method: "POST",
            path: "/orders",
            handler: "order.create",
            config: {
                auth: { scope: [] }, // ✅ Esto obliga a que el JWT esté presente y decodifica ctx.state.user
            },
        },

        {
            method: "GET",
            path: "/orders",
            handler: "order.find",
            config: {
                auth: false,
            },
        },
        {
            method: "GET",
            path: "/orders/:id",
            handler: "order.findOne",
            config: {
                auth: false,
            },
        },
        {
            method: "PUT",
            path: "/orders/:id",
            handler: "order.update",
            config: {
                auth: false,
            },
        },
        {
            method: "DELETE",
            path: "/orders/:id",
            handler: "order.delete",
            config: {
                auth: false,
            },
        },
    ],
};
