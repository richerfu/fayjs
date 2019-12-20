import { SoMiddleware, Middleware } from "../../dist/index";

@Middleware()
export class TestMiddleware extends SoMiddleware {
  public async run() {
    console.log("first middleware");
    await this.next();
  }
}
