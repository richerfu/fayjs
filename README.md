## **Fay.js**
[![GitHub stars](https://img.shields.io/github/stars/southorange1228/fayjs)](https://github.com/southorange1228/fayjs/stargazers)![npm](https://img.shields.io/npm/dt/fayjs)[![GitHub forks](https://img.shields.io/github/forks/southorange1228/fayjs)](https://github.com/southorange1228/fayjs/network)[![GitHub issues](https://img.shields.io/github/issues/southorange1228/fayjs)](https://github.com/southorange1228/fayjs/issues)![npm](https://img.shields.io/npm/v/fayjs)[![GitHub license](https://img.shields.io/github/license/southorange1228/fayjs)](https://github.com/southorange1228/fayjs/blob/master/LICENSE)

###  [Read Doc](https://southorange1228.github.io/)


a koa and typescript based web framework

- iqy-cli 脚手架支持
使用脚手架快速创建项目，全局安装脚手架。[脚手架地址](https://github.com/southorange1228/iqy-cli)
```shell
npm install iqy-cli -g

so init
```

- Quick Start
```shell
npm install fayjs --save
```
```typescript
// index.ts
import Fayjs from 'fayjs'

const server: Fayjs = new Fayjs()

server.Listen(12280)
```
```ts
//  test.controller.ts
import { BaseController, Controller, Get, Autowired } from 'fayjs'
import { TestService } from './test.service'
@Controller('/')
export class TestController extends BaseController {

  @Autowired
  private testService: TestService

  @Get('/')
  async name(){
    this.ctx.body = 'hello Fayjs'
  }
}
```
```ts
//  test.service.ts
import { BaseService,Service } from 'fayjs'

@Service
export class TestService extends BaseService {
  async query(): Promise<string>{
    return "aaa"
  }
}
```
- Run
```shell
ts-node index.ts
```

### Plugin
- [eslint-config-iqyserver]( https://github.com/southorange1228/eslint-config-iqyserver )
  
  eslint and prettier for iqyserver 
- [iqy-mysql]( https://github.com/southorange1228/iqy-mysql )
  
  mysql for iqy-server
