#### autocannon　QBS测试
测试命令为：
```shell
autocannon -c 100 -d 5 -p 2 url
```
均使用最简单的get请求，返回hello world响应，测试框架有koa,nest,midway,iqy-server。
最终结果在benchmark文件夹下。其中iqy-server基本和nest接近，midway性能最低。
