import { SoMiddleware, Middleware } from "iqy-server";

@Middleware()
export class TestMiddleware extends SoMiddleware {
  public async run() {
    console.log("first middleware");
    await this.next();
  }
}
