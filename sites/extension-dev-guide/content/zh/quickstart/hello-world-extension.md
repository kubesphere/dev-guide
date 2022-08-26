---
title:  创建 Hello World 扩展组件
weight: 02
description: 演示如何创建示例扩展组件 Hello World，帮助您快速了解扩展组件开发流程。
---

本节介绍如何创建一个简单的 Hello World 扩展组件，实现在 KubeSphere Web 控制台添加一个 `Hello World` 按钮并在用户点击按钮后显示 `Hello World!` 字符串。

本节内容帮助您快速了解：

* 如何初始化扩展组件开发项目。

* 如何在扩展组件前端模块中设置后端 API 服务的访问地址。

* 如何在 `dev-tools` 容器中运行扩展组件。

* 如何对扩展组件进行调试。

KubeSphere 扩展组件前端需要使用 React 框架进行开发。有关更多信息，请访问 [React 官方网站](https://reactjs.org)。

本节介绍的 Hello World 扩展组件仅包含前端模块。有关扩展组件前后端开发的完整示例，请参阅[示例与教程](zh/samples-and-tutorials/)。

### 前提条件

您需要提前搭建扩展组件开发环境。有关更多信息，请参阅[搭建开发环境](zh/get-started/prepare-development-environment/)。

### 初始化扩展组件开发项目

1. 登录开发主机，执行以下命令初始化扩展组件开发目录：

   ```bash
   mkdir -p ~/kubesphere-extensions
   ```

   ```bash
   cd ~/kubesphere-extensions
   ```

   ```bash
   yarn create ks-ext extensions-frontend
   ```

2. 执行以下命令创建 Hello World 扩展组件前端模块：

   ```bash
   cd extensions-frontend
   ```

   ```bash
   yarn create:ext
   ```

   根据命令提示设置扩展组件的名称、显示名称、描述、作者和语言，最后输入 `Yes` 完成扩展组件创建。

   ```bash
   Extension Name hello-world
   Display Name Hello World
   Descriptio Hello World!
   Author demo
   Language JavaScript
   Create extension [hello-world]? Yes
   ```

   以上命令执行完成后将生成如下目录结构：

   ```bash
   kubesphere-extensions
   └── extensions-frontend
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
       │           └── routes
       ├── package.json
       ├── tsconfig.base.json
       ├── tsconfig.json
       └── yarn.lock
   ```

   部分目录的功能如下：

   * `kubesphere-extensions`：扩展组件开发目录，可包含前端开发目录和后端开发目录。

     * `extensions-frontend`：扩展组件前端开发目录。
     
       * `extensions`：扩展组件前端模块目录，可包含多个扩展组件的前端模块。

         * `hello-world`：Hello World 扩展组件的前端模块。

### 设置 API 服务的访问地址

为使扩展组件前端模块可以访问 KubeSphere 后端 API 服务 `ks-apiserver`，您需要在 `local_config.yaml` 文件中设置 `ks-apiserver` 的访问地址。

执行以下命令设置 `ks-apiserver` 的访问地址：

```sh
perl -pi -e  "s/apiserver.local/`docker inspect --format '{{ .NetworkSettings.IPAddress }}' kubesphere`:30881/g" ~/kubesphere-extensions/extensions-frontend/configs/local_config.yaml
```

### 运行扩展组件

1. 执行以下命令运行 KubeSphere Web 控制台：

   ```bash
   yarn dev
   ```

2. 打开 Web 浏览器，访问 `http://localhost:8000`，并使用默认用户名 `admin` 和密码 `P@88w0rd` 登录 KubeSphere Web 控制台。

   页面左上角将显示 `Hello World` 按钮，点击 `Hello World` 将显示 `Hello World!` 字符串。

   ![demo-plugin-dashboard.png](images/zh/get-started/hello-world-extension-dashboard.png?width=1080px)

### 调试扩展组件

Hello World 扩展组件的源代码保存在 `~/kubesphere-extensions/extensions-frontend/extensions/hello-world` 目录中。您可以使用任意编辑器对 Hello World 扩展组件的源代码进行编辑。

例如，您可以将页面显示的字符串修改为 `Test!`，如下图所示：

![coding.png](images/zh/get-started/coding.png?width=1080px)

![preview.png](images/zh/get-started/preview.png?width=1080px)
