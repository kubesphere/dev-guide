---
title: 扩展组件结构解析
weight: 404
description: 解读 KubeSphere 扩展组件核心的概念
---


在上一个章节中，您已经可以在本地运行 ks-console 并正确加载扩展组件。下面我们来看看他是如何工作的？

Hello World 扩展组件做了 3 件事情

1. 在注册顶部导航栏菜单按钮，将扩展组件入口插入到顶部导航栏，便于快速访问扩展组件的页面。
2. 添加独立的页面路由，当用户访问 `http://localhost:8000/hello-world` 路径时可以正确的渲染扩展组件页面。
3. 实现扩展组件页面。

这三个步骤对于开发 KubeSphere 扩展组件来说至关重要，让我们仔细看看 Hello World 扩展组件的源代码，看看这些功能是如何实现的。

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
  "description": "Hello World",
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
  desc: 'Hello World',
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

您可以通过链接跳转到相关功能的说明页面获取更多信息。

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

