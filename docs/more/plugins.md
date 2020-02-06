### 插件系统（Plugin）

有了middleware之后，为什么我们还需要插件这个概念，在Koa中中间件会在每次请求的时候跟上下文相关联。但是有一些函数或者操作是与上下文无关的，比如数据库，消息队列等。

#### 基本使用方法

Plugin应该实现SoPlugin接口，初始化工作在start成员函数中完成，文件名应以plugin.ts结尾，否则不能正常工作。

Plugin注解传参，若无传参 将使用类名作为属性名，若传参将使用传入参数名作为属性名。

```typescript
// pluginA.plugin.ts
import { Plugin,SoPlugin } from 'iqy-server'

@Plugin("testPluginA")
export class PluginA implements SoPlugin {
    public app:any; 	// 服务器实例对象
    public config: any;	// config对象
    public start(){
        // code here
    }
    // code here some other method
}
```

这里给出一个Redis的例子，首先需要安装Redis，＠types/redis相关包。

```typescript
// redis.plugin.ts
import { createClient, RedisClient } from "redis";
import { Plugin, SoPlugin } from "iqy-server";

@Plugin("redis")
export class Redis implements SoPlugin {
  public app: any;
  public config: any;
  public conn: RedisClient;

  public start() {
    this.conn = createClient(this.config.redis.port, this.config.redis.host);
  }

  public set(key: string, value: string) {
    this.conn.set(key, value);
  }

  public get(key: string) {
    return this.conn.get(key);
  }
```

框架将会自动注入到controller，service，middleware中，在controller，service，middleware中即可使用。

```typescript
// test.controller.ts
import { SoController, Controller, Get } from "iqy-server";

@Controller("")
export class IndexController extends SoController {
  @Get("/")
  async index() {
    this.redis.get("test");
    this.ctx.body = "hello iqy-server";
  }
}

```

####  框架内置插件

- curl

  基于request包实现的简单请求方法，目前封装三种请求方式，使用时通过this.curl调用

  - init
  - get
  - post

- mysql

  基于mysql实现的封装对象，简单封装相关操作，支持单数据源和多数据源，详情参见[MySql部分](/high/mysql)

