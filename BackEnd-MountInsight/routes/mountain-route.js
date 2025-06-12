const {
  getMountainById,
  getAllMountain,
} = require("../handlers/mountain-handler");

const routes = [
  {
    method: "GET",
    path: "/mountain/{id}",
    handler: getMountainById,
  },
  {
    method: "GET",
    path: "/mountain/",
    handler: getAllMountain,
  },
];

module.exports = routes;
