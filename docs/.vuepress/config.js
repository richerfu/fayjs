module.exports = {
  title: "iqy-server",
  description: "a web framework by koa and typescript",
  themeConfig: {
    nav: [
      { text: "接口定义", link: "/apiword" },
      { text: "接口字段定义", link: "/api" },
      { text: "附录：错误码", link: "/error" },
    ],
    sidebar: [
      ['quickstart/quickStart','快速入门'],
      ['quickstart/controller','控制器(Controller)'],
      ['quickstart/service','服务(Service)'],
      ['quickstart/middleware','中间件(Middleware)']
    ],
    sidebarDepth: 0,
  },
};
