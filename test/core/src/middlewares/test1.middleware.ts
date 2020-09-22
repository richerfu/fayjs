import { Middleware, FMiddleware } from "../../../../dist";
import { Context, Next } from "koa";

@Middleware(2)
export class TestAMiddleware implements FMiddleware {
  public ctx: Context;
  public next: Next;
  public config: any;
  public async resolve() {
    console.log("middleware2");
    await this.next();
  }
}
