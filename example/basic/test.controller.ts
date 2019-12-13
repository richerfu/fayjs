import { SoController, Controller, Get, Autowired } from "./../../dist/core";
import { TestService } from "./test.service";

@Controller("/")
export class TestController extends SoController {
  @Autowired
  private testService: TestService;
  @Get("/")
  public async name() {
    console.log(this.testService.query());
    this.ctx.body = "hello iqyserver";
  }
}
