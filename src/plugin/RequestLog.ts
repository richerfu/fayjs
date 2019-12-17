import * as Koa from "koa";
import { getFormatTime } from "./../utils/Common";
export async function RequestLog(ctx: Koa.Context, next: Koa.Next) {
  const reqTime = new Date();
  await next();
  const resTime = new Date();
  console.log(
    `=>${getFormatTime(reqTime)}\t ${ctx.request.method}\t ${
      ctx.request.url
    }\t ${resTime.valueOf() - reqTime.valueOf()} ms\t`
  );
}
