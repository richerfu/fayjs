import * as Koa from 'koa'
class SoContext {
  public ctx: Koa.Context;
  public next: Koa.Next
  constructor(ctx: Koa.Context,next: Koa.Next) {
    this.ctx = ctx;
    this.next = next
  }
}

export class SoController extends SoContext {
  constructor(ctx: Koa.Context,next: Koa.Next) {
    super(ctx,next);
  }
}

export class SoService extends SoContext {
  constructor(ctx: Koa.Context,next: Koa.Next){
    super(ctx,next)
  }
}

export class SoMiddleware extends SoContext {
  constructor(ctx: Koa.Context,next: Koa.Next){
    super(ctx,next)
  }
}