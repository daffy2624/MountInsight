const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Path = require("path"); 

const profile_routes = require("./routes/profile-route");
const mountain_routes = require("./routes/mountain-route");
const comment_routes = require("./routes/comment-route");
const auth_routes = require("./routes/auth-route");

const init = async () => {
  const server = Hapi.server({
    port: 8000,
    host: "localhost",
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Registrasi plugin inert
  await server.register(Inert);

  // Tambahkan route untuk file statis
  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "public"), // <== Folder public
        index: true,
      },
    },
  });

  server.route(profile_routes);
  server.route(mountain_routes);
  server.route(comment_routes);
  server.route(auth_routes);

  await server.start();
  console.log(`Server telah berjalan pada ${server.info.uri}`);
};

init();
