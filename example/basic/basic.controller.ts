import {
  SoController,
  Controller,
  Get,
  Autowired,
  Post,
  Body,
  RequestBody,
  RequestQuery,
} from "../../dist/index";
import { TestService } from "./basic.service";

@Controller("/")
export class TestController extends SoController {
  @Autowired
  private testService: TestService;
  @Get("/")
  public async name(@RequestQuery("name") name: string) {
    console.log(this.wss);
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
