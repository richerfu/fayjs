import SoServer from "iqy-server";

const server: SoServer = new SoServer({
  baseDir: __dirname,
});

server.Listen(3001);
