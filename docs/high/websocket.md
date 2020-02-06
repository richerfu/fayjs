### WebSocket

websocket目前没有用过内置插件的方式实现，建议用户自建插件实现。

这里使用[socket.io](https://socket.io/docs/)实现，scoket.io相关操作可参阅文档。

```typescript
import * as Socket from "socket.io";
import { Plugin, SoPlugin } from "iqy-server";
import { createServer, Server } from "http";

@Plugin("ws")
export class WsSocket implements SoPlugin {
  public ws: Socket.Server;
  public config: any;
  public app: any;

  start() {
    const serve = createServer(this.app.callback());
    this.ws = Socket(serve);
    // 这一步是必须的，从app实例的listen方法转到http实例创建的listen，否则无法同时将socket的监听端口和HTTP的端口相同。
    this.app.Listen = function(...arg: any[]) {
      serve.listen.apply(serve, arg);
      return serve;
    };
  }
}

```

