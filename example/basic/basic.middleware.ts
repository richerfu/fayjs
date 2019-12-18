import { SoMiddleware, Middleware } from "../../dist/index";

@Middleware()
export class TestMiddleware extends SoMiddleware {
  public async run() {
    await this.next();
  }
}
