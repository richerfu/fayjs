import { Middleware, BaseMiddleware } from "../../../../dist";
import { Context, Next } from "koa";

@Middleware(-1)
export class TestAMiddleware implements BaseMiddleware {
  public ctx: Context;
  public next: Next;
  public config: any;
  public async resolve() {
    console.log("middleware2");
    await this.next();
  }
}