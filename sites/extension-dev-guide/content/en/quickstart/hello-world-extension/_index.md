---
title: Create a Hello World Extension
weight: 2
description: Describes how to create a demo extension "Hello World".
---

After reading this topic, you will get:

* how to initialize a project for extension development.

* how to launch the KubeSphere web console in your local environment.

* how to debug an extension.

### Prerequisites

A development environment is ready. For more information, view [Build a Development Environment](../../quickstart/prepare-development-environment/).

KubeSphere adopts React for the frontend development of extensions. For more information, visit [React official website](https://reactjs.org).

### Initialize a project for extension development

1. Initialize a project for extension development:

   ```bash
   mkdir -p ~/kubesphere-extensions
   cd ~/kubesphere-extensions
   yarn add global create-ks-project
   yarn create ks-project ks-console
   ```

The project contains a KubeSphere web console that can run locally.

2. Create a Hello World extension:

   ```bash
   cd ks-console
   yarn create:ext
   ```

     Configure basic information, for example, the extension name, alias, description, author, and language.

   ```bash
   Extension Name hello-world
   Display Name Hello World
   Description Hello World!
   Author demo
   Language JavaScript
   Create extension [hello-world]? Yes
   ```

   The following directory is generated:

   ```bash
   kubesphere-extensions          
   └── ks-console                   # Extension frontend development directory
       ├── babel.config.js
       ├── configs
       │   ├── config.yaml
       │   ├── console.config.js
       |   ├── webpack.config.js    # webpack configuration file
       │   └── local_config.yaml    # Configuration file of the KubeSphere Console
       ├── extensions               # Source code directory for the extension
       │   ├── entry.ts
       │   └── hello-world          # Source code directory for the Hello World extension
       │       ├── Dockerfile
       │       ├── README.md
       │       ├── package.json
       │       └── src
       │           ├── App.jsx
       │           ├── index.js
       │           ├── locales
       │           └── routes
       ├── package.json
       ├── tsconfig.base.json
       ├── tsconfig.json
       └── yarn.lock
   ```


### Configure the KubeSphere web console

To make the KubeSphere web console run locally, you need to [Build a Development Environment](../prepare-development-environment/), obtain the address of the KubeSphere API server, and then configure the `local_config .yaml` file as below.

```yaml
server:
  apiServer:
    url: http://172.31.73.3:30881  # IP and port of `ks-apiserver`
    wsUrl: ws://172.31.73.3:30881  # IP and port of `ks-apiserver`
```


### Launch the KubeSphere web console and load the extension

1. Launch the KubeSphere web console in your local environment:

   ```bash
   yarn dev
   ```

2. Open a browser, visit `http://localhost:880`, and use the default username `admin` and password `P@88w0rd` to log in to the KubeSphere web console.

   The entry of `Hello World` appears on the top navigation bar. Click `Hello World` to open the page.

   ![demo-plugin-dashboard.png](./hello-world-extension-dashboard.png?width=1080px)

### Debug the extension

The source code of the Hello World extension is stored in  `~/kubesphere-extensions/ks-console/extensions/hello-word/src`.

You can change the string displayed on the page to `Test!`, as shown in the following figures:

![coding.png](./coding.png?width=1080px)

![preview.png](./preview.png?width=1080px)

### Learn more

The demo extension only contains the frontend part, showing the basic features of extensions. For more development examples, please refer to [Development Examples](../../examples).