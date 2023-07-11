---
title: Frontend extensions
weight: 1
description: Describes KubeSphere frontend extensions.
---

To enable flexibility and scalability, KubeSphere adopts an architecture that consists of a `microkernel and extension components`. In this architecture, the microkernel provides only the basic features for system running, and business modules are encapsulated separately in extension components. You can dynamically install, uninstall, start, or stop extension components during system running. The following figure shows the architecture:


![frontend-extension-arch](./frontend-arch.png)

## Principles

When it comes to decoupling megalithic applications and dynamic extensions, the buzzword `micro frontends` in recent years must pop into our mind. Well-known implementations of `micro frontends` such as qiankun and micro-app have done a lot of work on JavaScript sandboxes and styling isolation, so as to prevent the styles of sub-applications in a micro-frontend framework inadvertently affect the styles of other sub-applications. Styling isolation is often a compromise to solve specific technical debt or team coordination problems. If a front-end system integrates React, Vue, and Angular, it will be difficult to ensure UI consistency, and the size of the front-end bundle will also be significantly increased. Moreover, if each sub-application is isolated in its own runtime, and its integration with the main application is not tight enough.

To enable extensibility, KubeSphere LuBan 4.0 aims to implement `micro frontends` or `micro modules`, which are more lightweight and have less demand for styling isolation. In a `micro module` architecture, sub-applications can share the tech stack and runtime with the main application. This can achieve experience consistency, high integration, and easy dependency sharing, thereby improving operation efficiency. As shown in the preceding architecture, the development of extension components relies on common dependencies such as kube-design and @ks-console/shared. Then, extensions can be packaged and released by using CLI tools. In the Core module, you can sign up for and run extension components.

## Core components
The core components provide the following main features:
1. Extension management

   Two steps are important for extension management: load JavaScript bundles in the runtime and authorize and authenticate extensions. KubeSphere LuBan 4.0 uses SystemJS to load JavaScript bundles for extensions and defines standard specifications for extension integration with the Core module.
2. Communications

   EventBus is built in the Core module to facilitate communication between the Core module and extensions.
3. Routing management

   Based on React Router, the routes defined in the extensions will be integrated into the Core module for unified management when the extensions are authorized and authenticated.
4. Internationalization

   Based on i18next, KubeSphere LuBan 4.0 implements internationalization.  For extensions, developers can define translation files based on the format in i18next, and then authorize and authenticate the extensions in the Core module.
5. 扩展市场

   Similar to the extension mechanism of Google Chrome, KubeSphere LuBan 4.0 also provides a module for visualized management of extensions, which is convenient for users to install, uninstall, start, or stop extensions in the web console.

6. Basic pages

   The Core module provides necessary UI elements for system running, including the login page and page layout.
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

* `Out-of-tree extensions` are extensions developed by developers in their own repos, which can be compiled and packaged independently. 它们会发布在`扩展市场`上。If a user installs an extension, the Core module will load the `JavaScript bundle` of the extension and authorize and authenticate the extension.

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
KubeSphere provides some common components, tools, and libraries to help developers develop extensions efficiently, taking into account experience consistency and operation efficiency.
1. Common extension library [KubeDesign](https://github.com/kubesphere/kube-design)
2. Frontend scaffolding tool [create-ks-project](https://github.com/kubesphere/create-ks-project)
3. Lightweight status management library @ks-console/stook
4. General utility library @ks-console/shared
