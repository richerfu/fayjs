### 中间件（Middleware）

完全兼容Koa中间件，使用方法基本同Koa的中间件使用方式。

不同点在于：

- 同controller和service都需要继承于SoMiddleware用于获取到config，ctx，next等数据。
- 必须有public async run(){}的函数用于注册中间件
- 必须使用Middleware注解用于自动注入

####  基本使用

```typescript
import { SoMiddleware, Middleware } from "iqy-server";

@Middleware()
export class TestMiddleware extends SoMiddleware {
  public async run() {
    await this.next();
  }
}

```

