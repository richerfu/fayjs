import {SoController,Controller, Get} from './../../dist/core'

@Controller('/')
export class TestController extends SoController {
  @Get('/')
  async name(){
    this.ctx.body = 'hello iqyserver'
    console.log(this)
  }
}
