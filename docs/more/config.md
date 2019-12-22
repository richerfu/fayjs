###  配置（Config）

####  基本使用

使用Config注解自动注入，根据环境自动注入到ctx中。**如果没有设置则默认dev环境**

> 可以使用[cross-env](https://www.npmjs.com/package/cross-env)库用于跨平台设置环境

```typescript
// src/config/test.config.ts
import { Config } from "iqy-server";

//  Config注解参数 应该与设置的环境参数相同 否则无法注入 若没有设置 系统默认为dev
@Config("dev")
export class TestConfig {
  public mysql = {
    enable: true,
    client: {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "",
      database: "test_sql",
    },
  };
}
```

