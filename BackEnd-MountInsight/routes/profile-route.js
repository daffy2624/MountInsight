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
  },
];

module.exports = routes;
