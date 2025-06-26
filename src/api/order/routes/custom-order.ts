export default {
  routes: [
    {
      method: "POST",
      path: "/orders/start-payment",
      handler: "order.startPayment", // 👈 importante: usa el mismo nombre que el controller
      config: {
        auth: { scope: [] },
      },
    },
  ],
};
