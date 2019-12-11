#### iqy-server ####
- Quick Start
```shell
npm install iqy-server --save
```
```typescript
// index.ts
import SoServer from 'iqy-server'

const server: SoServer = new SoServer({
  baseDir: __dirname
})

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
