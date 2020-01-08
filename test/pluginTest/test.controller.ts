import {
  SoController,
  Controller,
  Get,
  Autowired,
  Post,
  Body,
  RequestBody,
  RequestQuery,
} from "../../../dist/index";
import { TestService } from "../test.service";

@Controller("/")
export class TestController extends SoController {
  @Autowired
  private testService: TestService;
  @Get("/")
  public async name() {
    this.ctx.body = "Test Get Method Success";
    
  }

  @Post("/test")
  public async names() {
    this.ctx.body = "Test Post Method Success";
  }
}
