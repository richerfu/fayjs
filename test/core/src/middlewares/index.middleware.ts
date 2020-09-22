import { Middleware, FMiddleware } from "../../../../dist";
import { Context, Next } from "koa";

@Middleware()
export class TestMiddleware implements FMiddleware {
  public ctx: Context;
  public next: Next;
  public config: any;
  public async resolve() {
    console.log("middleware1");
    await this.next();
  }
}
