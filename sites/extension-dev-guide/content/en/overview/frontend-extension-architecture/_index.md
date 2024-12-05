---
title: Frontend Extension Mechanism
weight: 02
description: Describes how to extend the frontend UI of KubeSphere.
---

To be more flexible and extensible, KubeSphere 4.0 adopts an architecture that consists of `a microkernel and extensions`. In this architecture, the microkernel provides only the basic features for system running, and business modules are encapsulated separately into extensions, which allows dynamically installing, uninstalling, enabling, or disabling extensions during system running. 

The following figure shows the architecture:

![luban-frontend-extension-architecture](./luban-frontend-extension-architecture.png?width=800px)

## Principles

When it comes to decoupling megalithic applications and dynamic extensions, the buzzword `micro frontends` in recent years must pop into your mind. Well-known implementations of `micro frontends` such as qiankun and micro-app have done a lot of work on JavaScript sandboxes and styling isolation, so as to prevent the styles of sub-applications in a micro-frontend framework from inadvertently affecting the styles of other sub-applications. Styling isolation is often a compromise to solve specific tech stack or team coordination problems. If a front-end system integrates React, Vue, and Angular, it will be difficult to ensure UI consistency, and the size of the front-end package will also be significantly increased. Moreover, if each sub-application is isolated in its runtime, its integration with the main application is not tight enough.

To enable extensibility, KubeSphere LuBan aims to implement `micro frontends` or `micro modules`, which are more lightweight and have less demand for styling isolation. In a `micro module` architecture, sub-applications can share the tech stack and runtime with the main application. This can achieve experience consistency, high integration, and easy dependency sharing, thereby improving operation efficiency. As shown in the above figure, the development of extensions relies on common dependencies such as [KubeDesign](https://github.com/kubesphere/kube-design) and [@ks-console/shared](https://www.npmjs.com/package/@ks-console/shared). Then, extensions can be packaged and released by using the [scaffolding tool](https://github.com/kubesphere/create-ks-project) and CLI tools. In the Core module, you can sign up for and run extensions.

## KubeSphere Core

The core components provide the following main features:

1. Extension management

   Two steps are important for extension management: load JavaScript bundles in the runtime and authorize and authenticate extensions. KubeSphere LuBan 4.0 uses SystemJS to load JavaScript bundles for extensions and defines standard specifications for extension integration with the Core module.

2. Communications

   EventBus(pub/sub) is built in the Core module to facilitate communication between the Core and extensions.

3. Routing management

   Based on React Router, the routes defined in the extensions will be integrated into the Core module for unified management when the extensions are authorized and authenticated.

4. Internationalization

   Based on i18next, KubeSphere LuBan 4.0 implements internationalization.  For extensions, developers can define translation files based on the format in i18next, and then authorize and authenticate the extensions in the Core module.

5. KubeSphere Marketplace

   Similar to the extension mechanism of Google Chrome, KubeSphere LuBan 4.0 also provides a module for visualized management of extensions, which is convenient for users to install, uninstall, start, or stop extensions in the web console.

6. Basic pages

   The Core module provides necessary UI elements for the system running, including the login page and page layout.

7. Backend for frontend (BFF)

   Use Koa to implement the BFF architecture. The Core module is responsible for home page rendering, request forwarding, data conversion, and lightweight backend task processing.


## Extensions

The extensions can be divided into the following types: `in-tree extensions` and `out-of-tree extensions`. Their differences are:

* `In-tree extensions` are functional modules required by the system, which are packaged with the `Core` module during compilation. `In-tree extensions` include:
1. Cluster management
2. Access control
3. Workspace management
4. Project management
5. App Store
6. Platform settings

* `Out-of-tree extensions` are extensions developed by developers in their repos, which can be compiled and packaged independently, and published in `KubeSphere Marketplace`. If a user installs an extension, the Core module will load the `JavaScript bundle` of the extension and authorize and authenticate the extension.

The frontend of `out-of-tree extensions` uses [create-ks-project](https://github.com/kubesphere/create-ks-project) for initialization, and the directory structure after initialization is as follows:

```bash
.
├── babel.config.js
├── configs
│   ├── config.yaml
│   ├── local_config.yaml
│   ├── webpack.config.js
│   └── webpack.extensions.config.js
├── extensions
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

The structure is the same as that of a regular React app. The difference lies in the definition of the entry. Examples are as follows:

```javascript
import routes from './routes'; // Import routes
import locales from './locales'; // Import localization files

// Define the entry point for the extension
const menus = [
  {
    parent: 'topbar', // Parent of the entry
    name: 'hello-world', // Entry name identifier
    link: '/hello-world', // Entry URL
    title: 'Hello World', // Entry name
    icon: 'cluster', // Entry icon
    order: 0, // Menu order
    desc: 'This is hello-world extension', // Entry description
    skipAuth: true, // Whether to skip authentication check
    isCheckLicense: false, // Whether to perform license check
  },
];

const extensionConfig = {
  routes,
  menus,
  locales,
};

export default extensionConfig;
```
You can initialize an extension by using a scaffolding tool and define an entry file as the above. The development mode of business code is the same as that of regular frontend projects. When the development is completed, the extension can be packaged and released, and the code is stored in its own repo, which will not affect the Core module.

## Development empowerment

To improve development efficiency, maintain the consistency of user experience, and ensure good operational efficiency, KubeSphere provides several components, tools, and libraries for extension development.

1. Common extension library [KubeDesign](https://github.com/kubesphere/kube-design)
2. Frontend scaffolding tool [create-ks-project](https://github.com/kubesphere/create-ks-project)
3. General utility library [@ks-console/shared](https://www.npmjs.com/package/@ks-console/shared)
