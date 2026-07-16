// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Xburn",
  // tagline: 'Dinosaurs are cool',
  favicon: "img/logo.png",
  // Set the production url of your site here
  url: "https://developer.d-robotics.cc",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  // baseUrl 与各兄弟仓一致取 repo 名(/<projectName>/),产物最终进 gh-pages 的 /xburn_doc 子路径
  baseUrl: "/xburn_doc/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "D-Robotics", // Usually your GitHub org/user name.
  projectName: "xburn_doc", // Usually your repo name.

  // 本地开发用 throw 严格模式；CI 用独立的 docusaurus.ci.config.js
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",

  // add by xgs for translate
  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["zh-Hans", "en"],
    localeConfigs: {
      en: {
        label: "EN",
      },
      "zh-Hans": {
        label: "CN",
      },
    },
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/", // 修改默认文档路径
          sidebarPath: "./sidebars.js",
          showLastUpdateTime: true, // 显示文档最后更新时间
        },
        blog: { showReadingTime: true },
        pages: { exclude: ["/imager/**", "**/dl/**"] },
        theme: { customCss: "./src/css/custom.css" },
        sitemap: { lastmod: "date" }, // 生成sitemap时包含最后修改时间
      }),
    ],
  ],
  plugins: [],
  markdown: {
    mermaid: true,
  },
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      // ✅ 新增：支持 h2 ~ h5 add by xgs for table of contents
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 5,
    },
      navbar: {
        title: "D-Robotics",
        logo: {
          alt: "地瓜机器人社区 logo",
          src: "img/logo.png",
          href: "https://d-robotics.cc/", // brand 由 src/theme/Navbar/Logo swizzle 接管,此 href 不生效
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Xburn",
          },
          {
            href: "https://developer.d-robotics.cc/",
            label: "Community",
            position: "left",
          },

          {
            href: "https://github.com/D-Robotics",
            label: "GitHub",
            position: "right",
          },
          // add by xgs for translate show
          {
            type: "localeDropdown",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "联系我们",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/D-Robotics",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} D-Robotics.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
  themes: [
    "@docusaurus/theme-mermaid",
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        // 性能优化
        hashed: true, // 启用长期缓存
        language: ["en", "zh"], // 中英文支持
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        docsRouteBasePath: "/", // 文档路径
        
        // 优化索引大小和加载速度
        indexDocs: true,
        indexBlog: false, // 禁用博客索引
        indexPages: false, // 禁用页面索引
        
        // 搜索行为优化
        searchResultContextMaxLength: 50, // 减少上下文长度
      },
    ],
  ],
};

export default config;
