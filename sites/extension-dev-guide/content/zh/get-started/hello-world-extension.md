---
title:  创建 Hello World 扩展组件
weight: 403
description: 演示如何创建一个简单的 KubeSphere 示例扩展组件 Hello World，快速了解开发扩展组件的流程 
---

参照前面的章节准备好 KubeSphere 集群环境与本地开发环境之后就可以开始扩展组件的开发了，我们从一个简单的 Hello World 项目开始。

## 初始化扩展组件项目

1. 创建项目脚手架

通过 `yarn create ks-ext <directory>` 命令初始化项目目录

```bash
$ cd ~/workspace/kubesphere
$ yarn create ks-ext my-ext
```

当看到如下的提示信息，表示项目初始化完成：

```
Success! Created my-ext at /Workspace/kubesphere/my-ext
Inside that directory, you can run several commands:

  yarn create:ext
    Create a new extension.

  yarn dev
    Starts the development server.

  yarn build:dll
    Builds the dll files.

  yarn build:prod
    Builds the app for production.

  yarn start
    Runs the built app in production mode.

We suggest that you begin by typing:

  cd my-ext
  yarn create:ext

And

  yarn dev

Done in 560.43s
```

2. 创建 Hello World 扩展组件

通过交互式命令，创建第一个拓展组件 hello-world

```bash
$ cd my-ext
$ yarn create:ext
yarn run v1.22.10
$ ksc create:ext
? Extension Name hello-world
? Display Name Hello World
? Description Hello World!
? Author
? Language JavaScript
? Ensure to create extension: [hello-world] ? Yes
✨  Done in 113.99s.
```

整体的项目目录结构如下

```bash
$ tree -I 'node_modules' -L 4
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
│           └── routes
├── package.json
├── tsconfig.base.json
├── tsconfig.json
└── yarn.lock
```


## 扩展组件的运行与调试

1. 配置 ks-apiserver 访问


扩展组件开发过程依赖 ks-apiserver 提供的 API，需要参考一下命令行修改本地配置文件

```sh
$ sed -i '' "s/apiserver.local/`docker inspect --format '{{ .NetworkSettings.IPAddress }}' kubesphere`:30881/g" ~/workspace/kubesphere/my-ext/configs/local_config.yaml # 配置 ks-apiserver 地址
```

{{% notice note %}}
上述命令将 ks-apiserver 的访问地址，写入 `configs/local_config.yaml` 配置文件中，本地环境中 kubesphere 容器的IP地址可以通过命令 `docker inspect --format '{{ .NetworkSettings.IPAddress }}' kubesphere` 获得，ks-apiserver 默认的访问端口为 30881。如果您的 kubesphere 容器部署在远程环境中，您需要将 kubesphere 容器的 30881 端口通过VPN、端口转发等方式暴露到开发环境中，并根据实际情况修改命令行中 ks-apiserver 的地址与端口信息。 
{{% /notice %}}


2. 运行

前端的开发与普通的 react app 开发基本无异，执行以下命令在容器中运行 ks-console 并加载 Hello World 扩展组件。

```
$ yarn dev
yarn run v1.22.10
$ concurrently -k --raw 'yarn dev:client' 'yarn dev:server'
$ ksc-server
$ ksc dev
Dashboard app running at port 8000

✔ Webpack-bar
  Compiled successfully in 8.67s

<i> [webpack-dev-server] Project is running at:
<i> [webpack-dev-server] Loopback: http://localhost:8001/
<i> [webpack-dev-server] On Your Network (IPv4): http://192.168.1.133:8001/
<i> [webpack-dev-server] On Your Network (IPv6): http://[fe80::1]:8001/
<i> [webpack-dev-server] Content not from webpack is served from '/Workspace/kubesphere/my-ext/dist' directory
<i> [webpack-dev-server] 404s will fallback to '/index.html'
Successfully started server on http://localhost:8000
```

在创建 dev-tools 容器时我们就已经配置了 8000 与 8001 端口的映射规则，此时在本机访问 `http://localhost:8000` 并使用默认用户名密码（admin/P@88w0rd）登录 ks-console，您的第一个 KubeSphere 扩展组件已经成功加载，您可以通过点击顶部导航栏菜单访问该扩展组件的页面。

![demo-plugin-dashboard.png](images/get-started/hello-world-extension-dashboard.png)

3. 调试

您可以通过文本工具或是任何 IDE 打开挂载到容器内部的工程目录 `~/workspace/kubesphere/my-ext` 对我们的扩展组件的代码进行编辑，可以在浏览器中实时看到我们的修改。

![coding.png](images/get-started/coding.png)

![preview.png](images/get-started/preview.png)



