const { register, login } = require("../handlers/auth-handler");

const routes = [
  {
    method: "POST",
    path: "/register",
    handler: register,
  },
  {
    method: "POST",
    path: "/login",
    handler: login,
  },
];

module.exports = routes;
