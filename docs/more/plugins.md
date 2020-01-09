### 插件系统（Plugin）

#### 基本使用方法

在插件类的构造函数中会传入两个参数（Config：用户配置文件 参考config部分内容,App：iqyserver实例） 用于用户自己调用。

Plugin注解传参，若无传参 将使用类名作为属性名，若传参将使用传入参数名作为属性名。

```typescript
// pluginA.plugin.ts
import {Plugin} from 'iqy-server'

@Plugin()
export class PluginA {
    constructor(config: any,app:any){
        
    }
}
```

