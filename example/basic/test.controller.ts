import {
  SoController,
  Controller,
  Get,
  Autowired,
  Post,
  Body,
  RequestBody,
  RequestQuery,
} from "./../../dist/index";
import { TestService } from "./test.service";

@Controller("/")
export class TestController extends SoController {
  @Autowired
  private testService: TestService;
  @Post("/")
  public async name(@RequestQuery("name") name: string) {
    this.testService.query();
    this.ctx.body = "hello iqyserver";
  }

  @Get("/test")
  public async names(@RequestQuery("name") name: string) {
    console.log(name);
    this.testService.query();
    this.ctx.body = "test";
  }
}
