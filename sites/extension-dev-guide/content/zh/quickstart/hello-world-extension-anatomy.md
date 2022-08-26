---
title: Hello World 扩展组件解析
weight: 03
description: 解读 Hello World 扩展组件的工作方式
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

`package.json` 文件中包含了扩展组件的基础信息与 ` Node.js` 元数据。

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

在这个快速入门中，我们学习了如何在本地创建、运行和调试一个简单扩展组件的前端部分。一个完整的、具备实际业务能力的扩展组件应包含前后端，甚至需要通过 API 与外部系统或工具进行集成；同时，还需要将扩展组件打包和部署。也可以发布到扩展组件中心，与他人分享您开发的扩展组件。下面是一些建议的学习路线来进一步提高您开发 KubeSphere 扩展组件的技能：

[系统架构](zh/architecture) 该章节帮助大家深入了解 KubeSphere 4.0 基于扩展机制的系统架构。

[扩展组件定制](zh/customize-extensions) 在该章节中，我们将 KubeSphere API 和扩展点按照功能划分为几个类别，每个类别都有关于您的扩展可以实现什么功能的简短描述。通过查看 KubeSphere API 或阅读扩展功能定制部分，可以了解 KubeSphere 的扩展能力。

[示例与教程](zh/samples-and-tutorials) 我们有大量示例与文字或视频教程，其中包含了一些详细解读源代码的指南。您可以在示例与教程列表或 [extension-samples](https://github.com/kubesphere/extension-samples) 仓库中找到所有示例和指南。

[测试和发布](zh/testing-and-publishing) 该章节介绍如何保证开发高质量 KubeSphere 扩展组件并将其发布到扩展组件中心。

[最佳实践](zh/best-practices) 为了帮助您的扩展组件无缝融入 KubeSphere 用户界面，此章节介绍了大量创建扩展组件 UI 的最佳实践。

