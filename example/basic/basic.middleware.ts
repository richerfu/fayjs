import { SoMiddleware, Middleware } from "../../dist/index";

@Middleware()
export class TestMiddleware extends SoMiddleware {
  public async run() {
    console.log(123);
    await this.next();
  }
}
