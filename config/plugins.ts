export default ({ env }) => ({
  // ...
  "users-permissions": {
    config: {
      register: {
        allowedFields: ["fullName", "dni"],
      },
    },
  },
  // ...
});