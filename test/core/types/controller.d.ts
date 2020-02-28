import { BaseController } from 'fayjs';
undefinedundefinedimport { TestPlugin } from '../src/plugins/index.plugin'; 

declare module 'fayjs' {
  interface BaseController {
    curl: Curl;
    db: MySQL;
    pluginsA: TestPlugin;
    
  }
}
