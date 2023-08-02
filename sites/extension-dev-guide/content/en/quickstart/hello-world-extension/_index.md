---
title: Create a Hello World Extension
weight: 2
description: Describes how to create a demo extension "Hello World".
---

This section describes how to create a Hello World extension and add a separate page in the KubeSphere web console.

After reading this topic, you can get to know:

* how to initialize a project for extension development.

* how to launch the KubeSphere web console in your local environment.

* how to debug an extension.

KubeSphere adopts React for the development of frontend extensions. For more information, visit [React official website](https://reactjs.org).

This tutorial guides you through how to develop the frontend of the Hello World extension. For information about the complete tutorial, see [Examples](../../examples).

### Prerequisites

A development environment is ready. For more information, see [Build a development environment](../../quickstart/prepare-development-environment/).

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
   Descriptio Hello World!
   Author demo
   Language JavaScript
   Create extension [hello-world]? Yes
   ```

   The following directory is generated:

   ```bash
   kubesphere-extensions          
   └── ks-console                   # Project directory for the frontend extension
       ├── babel.config.js
       ├── configs
       │   ├── config.yaml
       │   ├── console.config.js
       │   └── local_config.yaml    # Configuration file of the KubeSphere web console
       ├── extensions               # Source code directory for the frontend extension
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

To make the KubeSphere web console run locally, you need to [build a development environment](../prepare-development-environment/), obtain the address of the KubeSphere API server, and then configure the `local_config .yaml` file.

```yaml
server:
  apiServer:
    url: http://172.31.73.3:30881
    wsUrl: ws://172.31.73.3:30881
```


### Launch the KubeSphere web console in your local environment

1. Launch the KubeSphere web console in your local environment:

   ```bash
   yarn dev
   ```

2. Open a browser, visit `http://localhost:880` and use default username `admin` and password `P@88w0rd` to log in to the KubeSphere web console.

   The access point to `Hello World` appears on the top navigation bar. Click `Hello World` to open the page.

   ![demo-plugin-dashboard.png](./hello-world-extension-dashboard.png?width=1080px)

### Debug the extension

The source code of the Hello World extension is stored in  `~/kubesphere-extensions/ks-console/extensions/hello-word/src` .

You can change the string displayed on the page to `Test!`, as shown in the following figure:

![coding.png](./coding.png?width=1080px)

![preview.png](./preview.png?width=1080px)
