const {
  getProfileById,
  updateProfile,
} = require("../handlers/profile-handler");

const routes = [
  {
    method: "GET",
    path: "/profile/{id}",
    handler: getProfileById,
  },
  {
    method: "PUT",
    path: "/profile/{id}",
    handler: updateProfile,
    options: {
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        maxBytes: 10485760, // 10MB
        allow: 'multipart/form-data',
      },
    },
  },
];

module.exports = routes;
