const Hapi = require("@hapi/hapi");
const profile_routes = require("./routes/profile-route");
const mountain_routes = require("./routes/mountain-route");
const comment_routes = require("./routes/comment-route");
const auth_routes = require("./routes/auth-route");

const init = async () => {
  const server = Hapi.server({
    port: 8000,
    host: "localhost",
    routes: {},
  });

  server.route(profile_routes);
  server.route(mountain_routes);
  server.route(comment_routes);
  server.route(auth_routes);

  await server.start();
  console.log(`Server telah berjalan pada ${server.info.uri}`);
};

init();
