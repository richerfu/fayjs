import {
  SoController,
  Get,
  Controller,
  Autowired,
  Post,
  RequestHeader,
  RequestContext,
} from "../../../../dist";
import { TestService } from "../services/index.service";

@Controller()
export class TestController extends SoController {
  @Autowired
  private testService: TestService;

  @Get("/")
  async testServiceFunc() {
    const result = await this.testService.index();
    this.ctx.body = result;
  }

  @Get("/controller")
  async testControllerFunc() {
    this.ctx.body = "Test Controller Success";
  }

  @Get("/config")
  async testConfigFunc(@RequestContext() ctx:any,@RequestHeader('host') header: any) {
    console.log(ctx)
    console.log(header)
    this.ctx.body = JSON.stringify(this.config);
  }

  @Post("/formdata")
  async testFormDataFunc() {
    this.ctx.body = this.ctx.request.body;
  }
}
