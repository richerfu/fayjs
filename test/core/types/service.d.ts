import { SoService } from 'iqy-server';
import { TestPlugin } from '../../types'; 

declare module 'iqy-server' {
  interface SoService {
    pluginsA: TestPlugin;
    
  }
}
