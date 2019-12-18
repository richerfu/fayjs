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
    const s = await this.curl.get("https://www.baidu.com");
    console.log(s);
    this.ctx.body = "test";
  }
}
