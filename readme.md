#### iqy-server ####
- Quick Start
```shell
npm install iqy-server --save
```
```typescript
import {SoServer} from 'iqy-server'

const server: SoServer = new SoServer({
  baseDir: __dirname
})

server.Listen(12280)
```