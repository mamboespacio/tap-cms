module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/webhooks/mercadopago',
      handler: 'mercadopago.webhook',
      config: {
        auth: false,
      },
    },
  ],
};
