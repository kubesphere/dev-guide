---
title: Page Routes
weight: 4
description: "Describes how to create a feature page and configure route settings."
---

For development based on `React`, if our application contains multiple pages, it is necessary to configure route settingns for the application. 简单理解，路由是访问路径与 React 组件的映射关系。 In our extension development, routing can be used as follows:

## Principles

KubeSphere 4.0 adopts [react-router V6](https://reactrouter.com/docs/en/v6) for frontend routing. 为了更方便地实现路由注册，我们使用了 `Route Object` 的方式书写路由。 Example:
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

In some cases, you need to insert or replace new routes to existing routes. In such a scenario, you need to specify `parentRoute` as the parent route. For example, if you want to add a route to the left menu of the cluster management page, you first find the corresponding route definition in the ks console source code. In `packages/clusters/src/routes/index.tsx`, find the following code:

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

To add a route in `Overview`, use the following code:

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
In the preceding code, `parentRoute` indicates the parent route path of `Overview`.

## Route registration

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
You can define a route in `routes/index.js`, and then register the route in the entry file of the extensionn. Example:

```javascript
import routes from './routes';  // Import the route file
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
