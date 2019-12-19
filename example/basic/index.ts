import SoServer from "./../../dist";

const server: SoServer = new SoServer({
  baseDir: __dirname,
});

server.Listen(12280);
