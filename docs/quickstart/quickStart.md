## 快速入门

通过本文，快速入门iqy-server。

###  环境准备

- 操作系统：Win,Mac,Linux
- 系统环境： Node.js >= V7.6.0，最好选择LTS版本  
- TypeScript >= 3.0

### 快速初始化

```shell
mkdir demo && cd demo
npm init
npm install iqy-server --save
```

npm init时需要填写各种信息，根据自身情况填写。如果npm速度过慢，建议使用淘宝镜像源或者cnpm。

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2017",
    "experimentalDecorators": true,
    "suppressImplicitAnyIndexErrors": true,
    "emitDecoratorMetadata": true,
    "noImplicitAny": true,
    "moduleResolution": "node",
    "declaration": true,
    "sourceMap": true,
    "outDir": "dist", // TS文件编译后会放入到此文件夹内
    "baseUrl": ".",
    "paths": {
      "*": [
        "./node_modules/*",
        "./src/types/*"
      ]
    },
  },
  "include": [
    "src/**/*" //TS文件编译目录
  ]
}
```

在demo文件夹下新增tsconfig.json文件，[具体更多字段查看文档](https://www.tslang.cn/docs/handbook/tsconfig-json.html)

如果没有全局安装TypeScript,请在demo目录下安装TypeScript

```shell
npm install typescript --save-dev
```



###  启动

```js
// 在demo文件夹下新建src/index.ts文件
import SoServer from 'iqy-server';
const server:SoServer = new SoServer();
server.Listen(3000);
```

完成后，运行命令即可，如果想要直接运行ts文件，请使用ts-node

```shell
// 编译ts运行
tsc
node dist/index.js

//  直接运行ts 首先确保已经安装ts-node
npm install ts-node --save-dev
ts-node ./src/index.ts
```

