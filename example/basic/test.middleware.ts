import {SoMiddleware,Middleware} from './../../src/core'

@Middleware()
export class TestMiddleware extends SoMiddleware {
  async run(){
    console.log(123)
    await this.next()
  }
}