import { SoService } from 'iqy-server';
import { TestPlugin } from '../plugins/index.plugin'; 

declare module 'iqy-server' {
  interface SoService {
    pluginsA: TestPlugin;
    
  }
}
