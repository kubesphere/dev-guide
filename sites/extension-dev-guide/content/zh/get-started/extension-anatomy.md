---
title: Helo World 扩展组件结构解析
weight: 404
description: 解读 Helo World 扩展组件的工作方式
---

在上一个章节中，您已经可以在本地运行 ks-console 并正确加载扩展组件，下面我们来看看它是如何工作的。

Hello World 扩展组件做了 3 件事情：

1. 在顶部导航栏注册菜单按钮，便于快速访问扩展组件的页面。
2. 添加独立的页面路由，当用户访问 `http://localhost:8000/hello-world` 路径时可以正确的渲染扩展组件页面。
3. 实现扩展组件页面。

这三个步骤对于开发 KubeSphere 扩展组件来说至关重要，我们再仔细看看 Hello World 扩展组件的文件结构和源代码，进一步了解这些功能是如何实现的。

**扩展组件的目录结构**

```bash
$ tree extensions/hello-world 
extensions/hello-world
├── Dockerfile
├── README.md
├── package.json
└── src
    ├── App.jsx
    ├── index.js
    ├── locales
    │   ├── en
    │   │   ├── base.json
    │   │   └── index.js
    │   ├── index.js
    │   └── zh
    │       ├── base.json
    │       └── index.js
    └── routes
        └── index.js
```

### 定义扩展组件的基础信息

`package.json` 文件中包含了插件的基础信息与 ` Node.js` 元数据。

```json
{
  "name": "hello-world",
  "description": "Hello World!",
  "author": "",
  "version": "1.0.0",
  "homepage": "",
  "main": "dist/index.js",
  "files": [
    "dist"
  ],
  "dependencies": {}
}
```

### 扩展组件功能点

通过 `src/index.js` 向 ks-console 注册[导航栏](zh/customize-extensions/menu/)按钮、[多语言](zh/customize-extensions/internationalization/)等配置信息。

```js
import routes from './routes';
import locales from './locales';

const menu = {
  parent: 'topbar',
  name: 'hello-world',
  title: 'Hello World',
  icon: 'cluster',
  order: 0,
  desc: 'Hello World!',
  skipAuth: true,
};

const extensionConfig = {
  routes,
  menus: [menu],
  locales,
};

globals.context.registerExtension(extensionConfig);
```

通过 `src/routes/index.js` 向 ks-console 注册[页面路由](zh/customize-extensions/route)，访问该路由地址会渲染扩展组件中的功能页面。

```js
import React from 'react';
import App from '../App';

export default [
  {
    path: '/hello-world',
    element: <App />,
  },
];

```

### 扩展组件功能实现

`src/App.jsx` 实现了具体的功能，展示 `Hello World!` 字样。

```jsx
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.h3`
  margin: 8rem auto;
  text-align: center;
`;

export default function App() {
  return <Wrapper>Hello World!</Wrapper>;
}
```

### 了解更多

在您的第一个扩展组件中，您学习了如何在本地创建、运行和调试扩展。然而，我们只看到了冰山一角，扩展组件还可以通过 API 与外部系统或工具进行集成，帮助您实现更多有趣的功能；您可以将扩展组件打包并发布，通过扩展组件中心进行部署，与他人分享您开发的扩展组件。这里有一些建议的路线来进一步提高您的 KubeSphere 扩展组件开发技能：

[系统架构](zh/architecture) 该章节帮助大家深入了解 KubeSphere 4.0 基于扩展机制的系统架构。

[扩展组件定制](zh/customize-extensions) 在该章节中，我们将 KubeSphere API和扩展点按照功能划分为几个类别，每个类别都有关于您的扩展可以实现什么功能的简短描述。通过查看 KubeSphere API或阅读扩展功能定制部分，验证您的扩展组件想法是否可以实现。

[示例与教程](zh/samples-and-tutorials) 我们有大量示例与文字或视频教程，其中包含了一些详细解读源代码的指南。您可以在示例与教程列表或 [extension-samples](https://github.com/kubesphere/extension-samples) 仓库中找到所有示例和指南。

[测试和发布](zh/testing-and-publishing) 该章节的内容，可帮助您开发高质量 KubeSphere 扩展组件或将您的 KubeSphere 扩展组件发布到扩展组件中心。

[最佳实践](zh/best-practices) 为了帮助您的扩展组件无缝融入 KubeSphere 用户界面，您将在此章节中学习创建扩展组件 UI 的最佳实践。

