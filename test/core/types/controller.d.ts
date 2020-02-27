import { SoController } from 'iqy-server';
import { TestPlugin } from '../../types'; 

declare module 'iqy-server' {
  interface SoController {
    pluginsA: TestPlugin;
    
  }
}
