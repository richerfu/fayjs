import {SoMiddleware,Middleware} from './../../dist/core'

@Middleware()
export class TestMiddleware extends SoMiddleware {
  async run(){
    console.log(123)
    await this.next()
  }
}
