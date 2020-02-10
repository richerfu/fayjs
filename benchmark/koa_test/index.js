/* eslint-disable */
const koa = require("koa");
const koarouter = require("koa-router")();

const app = new koa();

koarouter.get("/", async (ctx, next) => {
  ctx.body = "hello world";
});

app.use(koarouter.routes());
app.use(koarouter.allowedMethods());

app.listen(3000);
