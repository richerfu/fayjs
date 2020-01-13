## **iqy-server**
[![GitHub stars](https://img.shields.io/github/stars/southorange1228/iqy-server)](https://github.com/southorange1228/iqy-server/stargazers)![npm](https://img.shields.io/npm/dt/iqy-server)[![GitHub forks](https://img.shields.io/github/forks/southorange1228/iqy-server)](https://github.com/southorange1228/iqy-server/network)[![GitHub issues](https://img.shields.io/github/issues/southorange1228/iqy-server)](https://github.com/southorange1228/iqy-server/issues)![npm](https://img.shields.io/npm/v/iqy-server)[![GitHub license](https://img.shields.io/github/license/southorange1228/iqy-server)](https://github.com/southorange1228/iqy-server/blob/master/LICENSE)

###  [Read Doc](https://southorange1228.github.io/)


a koa and typescript based web framework

- Quick Start
```shell
npm install iqy-server --save
```
```typescript
// index.ts
import SoServer from 'iqy-server'

const server: SoServer = new SoServer()

server.Listen(12280)
```
```ts
//  test.controller.ts
import {SoController,Controller, Get,Autowired} from 'iqy-server'
import { TestService } from './test.service'
@Controller('/')
export class TestController extends SoController {

  @Autowired
  private testService: TestService

  @Get('/')
  async name(){
    this.ctx.body = 'hello iqyserver'
  }
}
```
```ts
//  test.service.ts
import {SoService,Service } from 'iqy-server'

@Service
export class TestService extends SoService {
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
