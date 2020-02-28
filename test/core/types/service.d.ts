import { BaseService } from 'fayjs';
import { TestPlugin } from '../src/plugins/index.plugin'; 

declare module 'fayjs' {
  interface BaseService {
    pluginsA: TestPlugin;
    
  }
}
