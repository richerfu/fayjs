import * as Koa from "koa";
import { getFormatTime } from "../utils/common";
import logger from "../utils/logger";

export async function RequestLog(ctx: Koa.Context, next: Koa.Next) {
  const reqTime = new Date();
  await next();
  const resTime = new Date();
  logger.info(
    `=>${getFormatTime(reqTime)}\t ${ctx.request.method}\t ${
      ctx.request.url
    }\t ${ctx.status}\t ${resTime.valueOf() - reqTime.valueOf()} ms\t`
  );
}
