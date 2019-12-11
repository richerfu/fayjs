import SoServer from './../../src/core'


const server:SoServer = new SoServer({
  baseDir: __dirname
})

server.Listen(12280)
