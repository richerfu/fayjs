### 控制器（Controller）

同常见的MVC开发，用于解析用户请求和返回用户响应，写过SpringMVC的话，将会很熟悉此类写法。

#### 编写Controller

规范：

- controller文件必须以.controller.ts结尾
- controller类必须继承于SoController,否则无法在当前实例中获取到ctx及其他相关属性
- 必须使用@Controller注解，用于自动加载route以及增加路由前缀

```typescript
// 新增src/controller/test.controller.ts文件
import {SoController,Controller,Get} from 'iqy-server'

@Controller("/")
export TestController extends SoController {
    
    @Get("/")
    async test(){
        this.ctx.body = "hello iqy-server"
    }
}
```

如上示例代码所见，Get即确定当前请求路径和请求方式（使用目前REST结构），目前支持Get,Post,Put,Delete,Patch五种请求方式。

####  Controller中使用Service

通常在MVC开发中我们一般将数据库等操作放在service中和业务解耦，当我们编写好了一个service之后，只需要在controller中，引入即可。

```typescript
// 假设已经存在src/service/test.service.ts文件
import {SoController,Controller,Get,Autowired} from 'iqy-server'
import {TestService} from '../service/test.service.ts'

@Controller("/")
export TestController extends SoController {
    
    @Autowired
    private testService: TestService
    
    @Get("/")
    async test(){
        //  code in here
        this.ctx.body = "hello iqy-server"
    }
}
```



