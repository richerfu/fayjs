import {
  SoController,
  Controller,
  Get,
  Autowired,
  RequestContext,
  RequestQuery,
  RequestHeader,
} from "iqy-server";
import { TestService } from "../service/basic.service";

@Controller("/")
export class TestController extends SoController {
  @Autowired
  private testService: TestService;
  @Get("/")
  public async name() {
    this.ctx.body = "hello world";
  }

  @Get("/test")
  public async names(@RequestQuery("name") name: string) {
    console.log(name);
    const s = await this.curl.get("https://www.baidu.com");
    this.ctx.body = "test";
  }
}
