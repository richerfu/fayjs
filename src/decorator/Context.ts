import * as Koa from 'koa'
import { Config } from './../types/interface';
class SoContext {
  public ctx: Koa.Context;
  public next: Koa.Next;
  public config: Config
  constructor(ctx: Koa.Context,next: Koa.Next,config: Config) {
    this.ctx = ctx;
    this.next = next;
    this.config = config
  }
}

export class SoController extends SoContext {
  constructor(ctx: Koa.Context,next: Koa.Next,config: Config) {
    super(ctx,next,config);
  }
}

export class SoService extends SoContext {
  constructor(ctx: Koa.Context,next: Koa.Next,config: Config){
    super(ctx,next,config)
  }
}

export class SoMiddleware extends SoContext {
  constructor(ctx: Koa.Context,next: Koa.Next,config: Config){
    super(ctx,next,config)
  }
}
