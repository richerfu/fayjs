import { BaseController } from 'iqy-server';
import { TestPlugin } from '../plugins/index.plugin'; 

declare module 'iqy-server' {
  interface BaseController {
    pluginsA: TestPlugin;
    
  }
}
