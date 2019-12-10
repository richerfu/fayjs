import {SoController,Controller, Get} from './../../src/core'

@Controller('/')
export class TestController extends SoController {
  @Get('/')
  async name(){
    this.ctx.body = 'hello iqyserver'
  }
}
