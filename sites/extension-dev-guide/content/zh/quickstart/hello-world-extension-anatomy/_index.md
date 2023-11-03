---
title: 解析 Hello World 扩展组件
weight: 03
description: 解读 Hello World 扩展组件的工作方式
---

在前一节中，您已学习如何在本地运行 KubeSphere Console 并成功加载扩展组件。现在，让我们深入了解它的工作原理。

加载 Hello World 扩展组件时，它执行了以下三个关键任务，这对于 KubeSphere 扩展组件的开发至关重要。

1. 在顶部导航栏注册了一个菜单按钮，以方便用户快速访问该扩展组件的页面。
2. 添加了独立的页面路由，当用户访问 `http://localhost:8000/hello-world` 时可以正确地渲染扩展组件页面。
3. 实现了扩展组件的页面内容。

现在，让我们更详细地查看 Hello World 扩展组件的文件结构和源代码，以深入了解这些功能是如何实现的。

### 扩展组件的目录结构

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

### 扩展组件的基础信息

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

通过 `src/index.js` 向 ks-console 注册[导航栏](../../feature-customization/menu/)按钮、[多语言](../../feature-customization/internationalization/)等配置信息。

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

通过 `src/routes/index.js` 向 ks-console 注册[页面路由](../../feature-customization/route)，访问该路由地址会渲染扩展组件的功能页面。

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

通过 `src/App.jsx` 实现具体的功能，例如：展示 `Hello World!` 字样。

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


