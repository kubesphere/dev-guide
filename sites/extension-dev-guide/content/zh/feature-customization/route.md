---
title: 页面路由
weight: 04
description: "创建新的功能页面并设置路由"
---

在基于 `React` 的开发中，如果我们的应用包含多个页面，那必然需要为应用设置路由。简单理解，路由是访问路径与 React 组件的映射关系。
在我们的扩展组件开发中，路由的使用方法如下：

## 路由定义

KubeSphere4.0 的前端路由使用了 [react-router V6](https://reactrouter.com/docs/en/v6)。为了更方便地实现路由注册，我们使用了 `Route Object` 的方式书写路由。
形如：
```javascript
let routes = [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "/courses",
          element: <Courses />,
          children: [
            { index: true, element: <CoursesIndex /> },
            { path: "/courses/:id", element: <Course /> },
          ],
        },
        { path: "*", element: <NoMatch /> },
      ],
    },
  ];
```

某些情形下，我们需要向已存在的路由插入或替换新的路由。这种情况下，我们需要指定路由的父路由 `parentRoute`。比如我们想在集群管理的左侧菜单添加一个新的路由，我们首先去 ks console
源码中找到对应的路由定义。在 `packages/clusters/src/routes/index.tsx` 我们找到对应的代码，如下：

```javascript
const PATH = '/clusters/:cluster';

const routes: RouteObject[] = [
  {
    path: '/clusters',
    element: <Clusters />,
  },
  {
    path: PATH,
    element: <BaseLayout />,
    children: [
      {
        element: <ListLayout />,
        path: PATH,
        children: [
          {
            path: `${PATH}/overview`,
            element: <Overview />,
          },
          ...
```

如果我们想在 `Overview` 这一层新增一个路由，我们可以这样写：

```javascript
const PATH = '/clusters/:cluster';

export default [
  {
    path: `${PATH}/demo`,
    element: <App />,
    parentRoute: PATH,
  },
];
```
可以看到，这里定义的 `parentRoute` 是 `Overview` 路由的父级路由的 path。

## 路由注册

使用 `yarn create:ext` 初始化扩展组件目录后，默认会生成 routes 文件夹，如下面目录结构：

```shell
└── hello-world
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
我们可以将路由定义写在 `routes/index.js` 里。然后在扩展组件的 entry file 里注册路由，如下：

```javascript
import routes from './routes';  // 引入路由文件
import locales from './locales';  

const menu = {
  parent: 'topbar',
  name: 'hello-world',
  link: '/hello-world',
  title: 'HELLO_WORLD',
  icon: 'cluster',
  order: 0,
  desc: 'SAY_HELLO_WORLD',
  skipAuth: true,
};

const extensionConfig = {
  routes,
  menus: [menu],
  locales,
};

globals.context.registerExtension(extensionConfig);
```
