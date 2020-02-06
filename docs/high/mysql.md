### MySQL

mysql简单封装，支持单数据和多数据源，使用时配置config文件，单数据源和多数据源使用时有细微差异，请参照示例代码。

单数据源eg：使用时通过this.db.mysql调用。

```typescript
// dev.config.ts
import { Config } from "iqy-server";

@Config("dev")
export class DevConfig {
  public mysql = {
    enable: true, // 设置为true时才能够使用到mysql
    client: {
      host: "127.0.0.1",
      port: 3306,
      user: "",
      password: "",
      database: "",
    },
  };
}

// test.service.ts
import { SoService, Service } from "iqy-server";

@Service
export class LoginService extends SoService {
  async findUser() {
    const result = await this.db.mysql.exec("select * from admin_user", []);
    return result;
  }
}

```

多数据源eg：调用时通过this.db.get("xx")调用。

```typescript
// dev.config.ts
import { Config } from "iqy-server";

@Config("dev")
export class DevConfig {
  public mysql = {
    enable: true,
    clients: {
      db1: {
        host: "127.0.0.1",
        port: 3306,
        user: "",
        password: "",
        database: "",
      },
      db2: {
        host: "127.0.0.1",
        port: 3306,
        user: "",
        password: "",
        database: "",
      },
    },
  };
}

// test.service.ts
import { SoService, Service } from "iqy-server";

@Service
export class LoginService extends SoService {
  async findUser() {
    const result = await this.db.get("db1").exec("select * from admin_user", []);
    return result;
  }
}
```

