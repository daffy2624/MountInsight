const { getMountainById } = require("../handlers/mountain-handler");

const routes = [
  {
    method: "GET",
    path: "/mountain/{id}",
    handler: getMountainById,
  },
];

module.exports = routes;
