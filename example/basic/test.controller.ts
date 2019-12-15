import {
  SoController,
  Controller,
  Get,
  Autowired,
  Post,
  Body,
  RequestBody,
} from "./../../dist/index";
import { TestService } from "./test.service";

@Controller("/")
export class TestController extends SoController {
  @Autowired
  private testService: TestService;
  @Post("/")
  public async name(@Body() body: any, @RequestBody("name") name: string) {
    console.log(`name is ${name}`);
    console.log(this.ctx.request.body);
    this.testService.query();
    this.ctx.body = "hello iqyserver";
  }
}
