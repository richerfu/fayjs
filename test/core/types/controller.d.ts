import { SoController } from 'iqy-server';
import { TestPlugin } from '/home/southorange/project/node_project/iqy-server/test/core/src/plugins/index.plugin'; 

declare module 'iqy-server' {
  interface SoController {
    pluginsA: TestPlugin;
    
  }
}