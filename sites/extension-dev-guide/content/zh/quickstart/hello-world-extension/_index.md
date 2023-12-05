---
title:  创建 Hello World 扩展组件
weight: 02
description: 演示如何创建示例扩展组件 Hello World，帮助您快速了解扩展组件开发流程
---

本章节帮助您快速了解：

* 如何初始化扩展组件开发项目。
* 如何在本地运行 KubeSphere Console。
* 如何对扩展组件进行调试。

### 前提条件

您需要提前搭建扩展组件开发环境。有关更多信息，请参阅[搭建开发环境](../../quickstart/prepare-development-environment/)。

KubeSphere 扩展组件前端开发需要使用 React。有关更多信息，请访问 [React 官方网站](https://reactjs.org)。

### 初始化扩展组件开发项目

1. 执行以下命令初始化扩展组件开发项目：

   ```bash
   mkdir -p ~/kubesphere-extensions
   cd ~/kubesphere-extensions
   yarn add global create-ks-project
   yarn create ks-project ks-console
   ```

   KubeSphere 扩展组件开发项目中包含了一个可以在本地运行的 KubeSphere Console。

2. 执行以下命令创建 Hello World 扩展组件：

   ```bash
   cd ks-console
   yarn create:ext
   ```

   根据命令提示，设置扩展组件的名称、显示名称、描述、作者和语言等基础信息，完成扩展组件创建。

   ```bash
   Extension Name hello-world
   Display Name Hello World
   Description Hello World!
   Author demo
   Language JavaScript
   Create extension [hello-world]? Yes
   ```

   以上命令执行完成后将生成如下目录结构：

   ```bash
   kubesphere-extensions          
   └── ks-console                   # 扩展组件前端开发项目目录
       ├── babel.config.js
       ├── configs
       │   ├── config.yaml
       │   ├── console.config.js
       |   ├── webpack.config.js    # webpack 配置文件
       │   └── local_config.yaml    # KubeSphere Console 配置文件
       ├── extensions               # 扩展组件源代码目录
       │   ├── entry.ts
       │   └── hello-world          # Hello World 扩展组件的源代码目录
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

### 配置本地运行环境

在配置本地运行环境之前，请先搭建好开发环境，获取 KubeSphere API Server 的访问地址，并在 `local_config.yaml` 文件中进行如下配置。

```yaml
server:
  apiServer:
    url: http://172.31.73.3:30881 # ks-apiserver 的 IP 与端口地址
    wsUrl: ws://172.31.73.3:30881 # ks-apiserver 的 IP 与端口地址
```

### 本地运行 KubeSphere Console 并加载扩展组件

1. 执行以下命令运行 KubeSphere Console：

   ```bash
   yarn dev
   ```

2. 打开浏览器，访问 `http://localhost:8000`，并使用默认用户名 `admin` 和密码 `P@88w0rd` 登录 KubeSphere Console。

   页面顶部导航栏将出现 `Hello World` 扩展组件的访问入口，点击 `Hello World` 将打开 Hello World 扩展组件的页面。

   ![demo-plugin-dashboard.png](./hello-world-extension-dashboard.png?width=1080px)

### 调试扩展组件

Hello World 扩展组件的源代码保存在 `~/kubesphere-extensions/ks-console/extensions/hello-word/src` 目录中。

您可以将页面显示的字符串修改为 `Test!`，如下图所示：

![coding.png](./coding.png?width=1080px)

![preview.png](./preview.png?width=1080px)

### 了解更多

当前示例仅包含了前端扩展，展示了扩展组件的基础能力，[开发示例](../../examples/)这个章节包含了更多的例子提供参考。
