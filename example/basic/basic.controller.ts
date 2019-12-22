import {
  SoController,
  Controller,
  Get,
  Autowired,
  Post,
  Body,
  RequestBody,
  RequestContext,
  RequestQuery,
} from "../../dist/index";
import { TestService } from "./basic.service";

@Controller("/")
export class TestController extends SoController {
  @Autowired
  private testService: TestService;
  @Get("/")
  public async name(
    @RequestQuery("name") name: string,
    @RequestContext() ctx: any
  ) {
    console.log(name);
    // this.ctx.body = "hello iqyserver";
    console.log(ctx);
    ctx.body = "hello world";
  }

  @Get("/test")
  public async names(@RequestQuery("name") name: string) {
    console.log(name);
    const s = await this.curl.get("https://www.baidu.com");
    console.log(s);
    this.ctx.body = "test";
  }
}
