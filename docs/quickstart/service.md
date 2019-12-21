### Service

简单来说，Service 就是在复杂业务场景下用于做业务逻辑封装的一个抽象层，提供这个抽象有以下几个好处：

- 保持 Controller 中的逻辑更加简洁。
- 保持业务逻辑的独立性，抽象出来的 Service 可以被多个 Controller 重复调用。
- 将逻辑和展现分离，更容易编写测试用例。

#### 基本的Service

同controller一样，需要继承于SoService用于获取内置ctx，使用Service注解自动注入。

```typescript
// src/service/test.service.ts
import {SoService,Service} from 'iqy-server'

@Service
export TestService extends SoService {
    async query():Promise<any>{
        // code
        // eg: 
        // const result = await this.db.mysql.exec("select * from my_user",[])
        // return result
    }
}
```

####  更多

- 在Service中调用其他Service

  同service的使用，使用Autowired注解自动注入即可使用。

  ```typescript
  // src/service/newTest.service.ts
  import {SoService,Service,Autowired} from 'iqy-server'
  import {TestService} from './test.service.ts'
  
  @Service
  export NewTestService extends SoService {
      
      @Autowired
      private testService: TestService;
      
      async query():Promise<any>{
          // code
          // eg: 
          // const result = await this.db.mysql.exec("select * from my_user",[])
          // return result
      }
  }
  ```

  