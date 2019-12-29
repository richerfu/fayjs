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
  RequestHeader,
} from "iqy-server";
import { TestService } from "../service/basic.service";

@Controller("/")
export class TestController extends SoController {
  @Autowired
  private testService: TestService;
  @Get("/")
  public async name(
    @RequestQuery("name") name: string,
    @RequestHeader("host") host: string,
    @RequestContext() ctx: any
  ) {
    // this.ctx.body = "hello iqyserver";
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
