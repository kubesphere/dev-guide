---
title: 前端扩展机制
weight: 02
description: 如何对 KubeSphere 的前端 UI 进行扩展？
---

为了提高 KubeSphere 的灵活性和可扩展性，KubeSphere 4.0 采用了`微内核+扩展组件`的架构。在这个架构中，`微内核`部分仅包含系统运行所需的基础功能，而各个独立的业务模块则被封装在各个扩展组件中。这允许在系统运行时动态地安装、卸载、启用或禁用扩展组件。

总体架构如下图所示：

![luban-frontend-extension-architecture](./luban-frontend-extension-architecture.png?width=800px)

## 设计思想

在解耦巨石应用和实现动态扩展时，不可避免会考虑到近年来备受欢迎的`微前端`解决方案。著名的微前端实现，如 qiankun 和 micro-app，为了应对子应用的技术栈独立性和样式侵入问题，采取了大量措施，包括实施 JavaScript 沙箱和样式隔离等。然而，这种隔离通常是为了解决特定技术栈问题或团队协作问题而做出的妥协。如果将多个框架，如 React、Vue 和 Angular，融合到同一前端系统中，用户界面体验可能会不一致，而前端包的大小也可能显著增加。此外，各个子应用在各自独立的运行时中运行，可能与主应用的集成度不够紧密。

在这种背景下，我们希望减轻对隔离性的需求，以实现一种更轻量的"微前端"，或者可以称之为`微模块`。在微模块架构中，子应用和主应用共享相同的技术栈，可以共享运行时。这有助于实现更一致的用户体验、更高的集成度和更便捷的依赖共享，从而提高运行效率。如上面的架构图所示，扩展组件的开发依赖通用的 [KubeDesign](https://github.com/kubesphere/kube-design)、[@ks-console/shared](https://www.npmjs.com/package/@ks-console/shared) 等库。然后，使用[脚手架](https://github.com/kubesphere/create-ks-project)、CLI 等工具打包和发布扩展组件。在 Core（基座）的部分注册和运行扩展组件。

## 内核

如上图所示，内核的主要功能包括：

1. 扩展组件的管理

   扩展组件的管理涉及两个重要方面，即在运行时完成扩展组件的 JavaScript bundle 加载以及扩展组件的注册。在 4.0 版本的架构中，采用了 SystemJS 来实现对扩展组件 JavaScript bundle 的加载。同时，制定了扩展组件的入口规范，以确保它们能够连接到核心系统并运行。

2. 通讯机制

   在内核中内置 EventBus（发布/订阅），以方便内核与扩展组件之间以及扩展组件之间的通信。

3. 路由管理

   基于 react-router，扩展组件定义的路由在扩展组件注册时会被统一管理到内核中。

4. 国际化

   采用 i18next 实现国际化。开发者可以在扩展组件中按照 i18next 的格式定义翻译文件，然后按照约定注册到内核中。

5. 扩展中心

   类似于 Chrome 浏览器的扩展程序，KubeSphere 也提供了一个可视化的扩展组件管理模块，允许用户在页面上轻松执行扩展组件的安装、卸载、启用、禁用等操作。

6. 基础页面

   包括系统运行所需的一些基本 UI 元素，例如登录页面和页面布局。

7. BFF

   基于 Koa 实现的 BFF 层。主要负责首页渲染、请求转发、数据转换以及一些轻量级的后端任务。

## 扩展组件

如上图所示，扩展组件分为 `In-Tree 扩展组件` 和 `Out-of-Tree 扩展组件`。区别在于：

* `In-Tree 扩展组件` 基本上是系统必备或者常用的功能组件，它们在编译时与 `core` 一起打包。`In-Tree 扩展组件` 目前包括：
   1. Cluster 集群管理
   2. Access 访问控制
   3. Workspaces 工作空间
   4. Projects 项目管理
   5. Apps 应用商店
   6. Settings 平台设置

* `Out-of-Tree 扩展组件` 是由开发者在自己的代码仓库中开发的扩展组件，需要独立进行编译和打包。这些组件将被发布到 `扩展市场`。用户安装后，内核会远程加载扩展组件的 `js bundle` 并将其注册到内核中。

`Out-of-Tree 扩展组件` 的前端部分统一使用 [create-ks-project](https://github.com/kubesphere/create-ks-project) 脚手架工具进行初始化。初始化后的目录结构如下：

```bash
.
├── babel.config.js
├── configs
│   ├── config.yaml
│   ├── console.config.js
│   └── local_config.yaml
├── extensions
│   ├── entry.ts
│   └── hello-world
│       ├── Dockerfile
│       ├── README.md
│       ├── package.json
│       └── src
│           ├── App.jsx
│           ├── index.js
│           ├── locales
│           │   ├── en
│           │   │   ├── base.json
│           │   │   └── index.js
│           │   ├── index.js
│           │   └── zh
│           │       ├── base.json
│           │       └── index.js
│           └── routes
│               └── index.js
├── node_modules
├── package.json
├── tsconfig.base.json
├── tsconfig.json
└── yarn.lock
```

该目录结构和普通的 react app 基本一样，不同之处在于对 entry 的定义，如示例中所示：

```javascript
import routes from './routes';                   // 导入路由
import locales from './locales';                 // 导入国际化文件

const menu = {                                   // 定义菜单 
  parent: 'topbar',                              // 菜单父级
  name: 'hello-world',                           // 菜单 name 标识 
  link: '/hello-world',                          // 入口 url    
  title: 'Hello World',                          // 菜单名称  
  icon: 'cluster',                               // 菜单 icon
  order: 0,                                      // 菜单排序  
  desc: 'This is hello-world extension',         // 菜单描述
  skipAuth: true,                                // 是否忽略权限检查
};

const extensionConfig = {
  routes,
  menus: [menu],
  locales,
};

globals.context.registerExtension(extensionConfig);    // 通过全局对象注册扩展组件
```

如上所示，通过脚手架工具初始化后，定义扩展组件的入口文件。在开发过程中，其业务代码开发模式与普通前端项目相同。一旦开发完成，即可将扩展组件打包并发布到独立的代码仓库。这些扩展组件与内核部分相互独立，不会造成代码侵入。

## 开发赋能

为了提高扩展组件的开发效率，保持系统体验的一致性，确保良好的运行效率，KubeSphere 提供了一些通用的组件和工具库，供扩展组件开发使用。

1. 通用组件库 [KubeDesign](https://github.com/kubesphere/kube-design)
2. 前端脚手架工具 [create-ks-project](https://github.com/kubesphere/create-ks-project)
3. 轻量的状态管理库 [@kubed/stook](https://www.npmjs.com/package/@kubed/stook)
4. 通用 util 库 [@ks-console/shared](https://www.npmjs.com/package/@ks-console/shared)