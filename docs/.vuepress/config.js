module.exports = {
  title: "Future一点一滴",
  description: "Future一点一滴",
  theme: "reco",
  themeConfig: {
    // 作者
    author: "reco_luan",
    head: [
      [
        "meta",
        {
          name: "viewport",
          content: "width=device-width,initial-scale=1,user-scalable=no",
        },
      ],
    ],
    nav: [
      { text: "首页", link: "/" },
      {
        text: "Future的博客",
        items: [
          { text: "Github", link: "https://github.com/codehzy" },
          {
            text: "掘金",
            link: "https://juejin.cn/user/1714893872178823",
          },
        ],
      },
      { text: "TimeLine", link: "/timeline/", icon: "reco-blog" },
    ],
    sidebar: [
      // {
      //   title: "欢迎学习",
      //   path: "/",
      //   collapsable: false, // 不折叠
      //   children: [{ title: "学前必读", path: "/" }],
      // },
      // {
      //   title: "基础学习",
      //   path: "/handbook/ConditionalTypes",
      //   collapsable: false, // 不折叠
      //   children: [
      //     { title: "条件类型", path: "/handbook/ts/ConditionalTypes" },
      //     { title: "泛型", path: "/handbook/ts/Generics" },
      //   ],
      // },
    ],
    subSidebar: "auto", //在所有页面中启用自动生成子侧边栏，原 sidebar 仍然兼容
    lastUpdated: "上次更新", // string | boolean
    // 备案
    record: "苏ICP备20030191",
    recordLink: "ICP 备案指向链接",
    cyberSecurityRecord: "公安部备案文案",
    cyberSecurityLink: "公安部备案指向链接",
    // 项目开始时间，只填写年份
    startYear: "2022",
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: "Category", // 默认文案 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: "Tag", // 默认文案 “标签”
      },
      socialLinks: [
        // 信息栏展示社交信息
        { icon: "reco-github", link: "https://github.com/recoluan" },
        { icon: "reco-npm", link: "https://www.npmjs.com/~reco_luan" },
      ],
    },
  },
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
};
