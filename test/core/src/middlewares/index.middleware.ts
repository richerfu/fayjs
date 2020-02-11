import { Middleware, SoMiddleware } from "../../../../dist";
import { Context, Next } from "koa";

@Middleware()
export class TestMiddleware implements SoMiddleware {
  public ctx: Context;
  public next: Next;
  public config: any;
  public async resolve() {
    console.log("middleware1");
    await this.next();
  }
}
