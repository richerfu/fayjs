import { BaseService } from 'fayjs';
undefinedundefinedimport { TestPlugin } from '../src/plugins/index.plugin'; 

declare module 'fayjs' {
  interface BaseService {
    curl: Curl;
    db: MySQL;
    pluginsA: TestPlugin;
    
  }
}
