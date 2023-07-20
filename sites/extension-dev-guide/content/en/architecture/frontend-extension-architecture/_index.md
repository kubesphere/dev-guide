---
title: Frontend Extensions
weight: 1
description: 介绍 KubeSphere 前端扩展机制
---

To enable flexibility and scalability, KubeSphere adopts an architecture that consists of a `microkernel and extension components`. In this architecture, the microkernel provides only the basic features for system running, and business modules are encapsulated separately in extension components. 系统可在运行时动态地安装、卸载、启用、禁用扩展组件。The following figure shows the architecture:


![frontend-extension-arch](./frontend-arch.png)

## Principles

When it comes to decoupling megalithic applications and dynamic extensions, the buzzword `micro frontends` in recent years must pop into our mind. 知名的`微前端`实现比如 qiankun, micro-app，为了解决子应用技术栈无关、样式侵入问题，在 JS 沙箱、样式隔离上做了很多工作。而隔离往往是为了解决某些技术栈问题或者团队配合问题而做的妥协。If a front-end system integrates React, Vue, and Angular, it will be difficult to ensure UI consistency, and the size of the front-end bundle will also be significantly increased. Moreover, if each sub-application is isolated in its own runtime, and its integration with the main application is not tight enough.

在 KubeSphere LuBan 4.0 可扩展的需求背景下，我们希望弱化隔离的要求，实现一种更轻量的`微前端`，或者我们可以称之为`微模块`。In a `micro module` architecture, sub-applications can share the tech stack and runtime with the main application. This can achieve experience consistency, high integration, and easy dependency sharing, thereby improving operation efficiency. As shown in the preceding architecture, the development of extension components relies on common dependencies such as kube-design and @ks-console/shared. Then, extensions can be packaged and released by using CLI tools. In the Core module, you can sign up for and run extension components.

## Core components
The core components provide the following main features:
1. Extension management

   Two steps are important for extension management: load JavaScript bundles in the runtime and authorize and authenticate extensions. KubeSphere LuBan 4.0 uses SystemJS to load JavaScript bundles for extensions and defines standard specifications for extension integration with the Core module.
2. Communications

   内核中我们内置了EventBus(pub/sub), 可以方便地在内核和扩展组件之间、扩展组件与扩展组件之间进行通信。
3. Routing management

   Based on React Router, the routes defined in the extensions will be integrated into the Core module for unified management when the extensions are authorized and authenticated.
4. Internationalization

   Based on i18next, KubeSphere LuBan 4.0 implements internationalization.  For extensions, developers can define translation files based on the format in i18next, and then authorize and authenticate the extensions in the Core module.
5. Extension Marketplace

   类似 chrome 浏览器的扩展程序，我们也有一个可视化的扩展组件管理模块，方便用户在页面上实现对扩展组件的安装、卸载、启用、禁用等操作。

6. Basic pages

   系统运行的一些必备的 UI 元素，包括登录页面、页面 layout 等。
7. Backend for frontend (BFF)

   Use Koa to implement the BFF architecture. The Core module is responsible for home page rendering, request forwarding, data conversion, and lightweight backend task processing.


## Extensions

The extensions can be divided into the following types: `in-tree extensions` and `out-of-tree extensions`. In-tree extensions are different from out-of-tree extensions in the following aspects:
* `In-tree extensions` are functional modules required by the system, which are packaged with the `Core` module during compilation. `In-tree extensions` can enable the following features:
1. Cluster management
2. Access control
3. Workspace management
4. Project management
5. App Store
6. Platform settings

* `Out-of-tree extensions` are extensions developed by developers in their own repos, which can be compiled and packaged independently. They are rolled out on `Extension Marketplace`. If a user installs an extension, the Core module will load the `JavaScript bundle` of the extension and authorize and authenticate the extension.

The frontend components of `out-of-tree extensions` use [create-ks-ext](https://github.com/kubesphere/create-ks-project) for initialization. The directory after initialization is as follows:

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

It can be seen that this is basically the same as a regular React app. The difference lies in the definition of the entry. Examples are as follows:
```javascript
import routes from './routes';                   // Import routes
import locales from './locales';                 // Import locale files

const menu = {                                   // Declare a menu item
  parent: 'topbar',                              // Specify a parent item for the menu item
  name: 'hello-world',                           // Specify an identifier for the menu item
  link: '/hello-world',                          // Specify the URL that the menu item should link to
  title: 'Hello World',                          // Specify a name for the menu item
  icon: 'cluster',                               // Specify the icon that should be displayed next to the menu item
  order: 0,                                      // Specify the order in which the menu item should appear
  desc: 'This is hello-world extension',         // Specify the description for the menu item
  skipAuth: true,                                // Specify whether to skip authentication
};

const extensionConfig = {
  routes,
  menus: [menu],
  locales,
};

globals.context.registerExtension(extensionConfig);    // Globally register an extension
```
As shown in the preceding code, the extension is intialized by using a scaffolding tool and an entry file is generated. The development of business code is different from that of regular frontend projects. After the development is completed, the extension will be packaged and released. The extension code is stored in its own repo, which will not affect the styling of the Core module.

## Development empowerment
为方便开发者更高效地开发扩展组件，同时也为了系统体验一致性的约束及运行效率的考虑，我们提供了一些通用的组件、工具等库。
1. Common extension library [KubeDesign](https://github.com/kubesphere/kube-design)
2. Frontend scaffolding tool [create-ks-project](https://github.com/kubesphere/create-ks-project)
3. Lightweight status management library @ks-console/stook
4. General utility library @ks-console/shared
