import {
  SoController,
  Controller,
  Get,
  Autowired,
  Post,
} from "./../../dist/core";
import { TestService } from "./test.service";

@Controller("/")
export class TestController extends SoController {
  @Autowired
  private testService: TestService;
  @Post("/")
  public async name() {
    this.testService.query();
    this.ctx.body = "hello iqyserver";
  }
}
