const {
  getMountainById,
  getAllMountain,
  getMountainByName
} = require("../handlers/mountain-handler");

const routes = [
  {
    method: "GET",
    path: "/mountain/id/{id}",
    handler: getMountainById,
  },
  {
    method: "GET",
    path: "/mountain/name/{name}",
    handler: getMountainByName,
  },
  {
    method: "GET",
    path: "/mountain/",
    handler: getAllMountain,
  },
];

module.exports = routes;
