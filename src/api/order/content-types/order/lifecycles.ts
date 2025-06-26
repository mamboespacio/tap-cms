// type Order = {
//   id: number;
//   // otros campos que quieras tipar
// };

// export default {
//   async afterCreate(event: { result: Order }) {
//     const { result } = event;
//     await strapi.entityService.update('api::order.order', result.id, {
//       data: {
//         external_reference: `order_${result.id}`,
//       },
//     });
//   },
// };
