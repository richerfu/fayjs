import { SoController } from 'iqy-server';
import { TestPlugin } from '../plugins/index.plugin'; 

declare module 'iqy-server' {
  interface SoController {
    pluginsA: TestPlugin;
    
  }
}
