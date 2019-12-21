module.exports = {
  title: "iqy-server",
  description: "a web framework by koa and typescript",
  themeConfig: {
    sidebar: [
      {
        title: "快速开始",
        collapsable: false,
        children: [["quickstart/quickStart", "快速入门"]],
      },
      {
        title: "基础功能",
        collapsable: false,
        children: [
          ["quickstart/controller", "控制器(Controller)"],
          ["quickstart/service", "服务(Service)"],
          ["quickstart/middleware", "中间件(Middleware)"],
        ],
      },
      {
        title: '高级功能',
        collapsable: false,
        children:[
          ["high/mysql",'MySQL'],
          ["high/websocket","WebSocket"],
        ]
      },
      {
        title: "更多内容",
        collapsable: false,
        children: [
          ["more/config", "配置(Config)"],
          ["more/plugins", "插件(Plugins)"],
        ],
      },
    ],
    sidebarDepth: 2,
  },
};
