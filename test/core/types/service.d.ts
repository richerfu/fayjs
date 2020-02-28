import { BaseService } from 'iqy-server';
import { TestPlugin } from '../plugins/index.plugin'; 

declare module 'iqy-server' {
  interface BaseService {
    pluginsA: TestPlugin;
    
  }
}
