import { BaseController } from 'fayjs';
import { TestPlugin } from '../src/plugins/index.plugin'; 

declare module 'fayjs' {
  interface BaseController {
    pluginsA: TestPlugin;
    
  }
}
