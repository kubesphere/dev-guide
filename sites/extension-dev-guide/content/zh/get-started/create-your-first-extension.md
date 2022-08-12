---
title:  创建 Hello World 扩展组件
weight: 403
description: 创建一个简单的 KubeSphere 示例扩展组件 Hello World 
---

参照前面的章节准备好 KubeSphere 4.0 环境与本地开发环境之后就可以开始扩展组件的开发了，我们从一个简单的 Hello World 项目开始。

## 初始化扩展组件项目

1. 创建项目脚手架

通过 `yarn create ks-ext <directory>` 初始化项目目录

```bash
yarn create ks-ext my-ext
```

当看到如下的提示信息，表示项目初始化完成：

```
Success! Created my-ext at /Users/sombody/KubeSphereProjects/my-ext
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

✨  Done in 89.17s.
```

2. 创建 Hello World 扩展组件

通过交互式命令，创建第一个拓展组件 hello-world

```bash
$ cd hello-world
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

1. 将 ks-apiserver 代理至本地


扩展组件开发过程依赖 ks-apiserver 提供的 API，需要通过 kubectl port-forward 将 ks-apiserver 这个 service 代理到本地开发环境

```
$ kubectl -n kubesphere-system port-forward service/ks-apiserver 9090:80
Forwarding from 127.0.0.1:9090 -> 9090
Forwarding from [::1]:9090 -> 9090
```

上述命令将 ks-apiserver 代理至本地 http://127.0.0.1:9090，您也可以替换命令行中的本地端口

{{% notice note %}}
ks-apiserver 的本地代理地址需要与 `configs/local_config.yaml` 配置文件中 `server.apiServer` 的配置一致，默认值为 `http://127.0.0.1:9090`。
{{% /notice %}}



2. 本地运行

前端的开发与普通的 react app 开发基本无异，执行以下命令本地运行 ks-console 并加载 Hello World 扩展组件。

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
<i> [webpack-dev-server] Content not from webpack is served from '/Users/somebody/KubeSphereProjects/my-ext/dist' directory
<i> [webpack-dev-server] 404s will fallback to '/index.html'
Successfully started server on http://localhost:8000
```


访问 `http://localhost:8000` 并使用默认用户名密码（admin/P@88w0rd）登录 ks-console，您的第一个 KubeSphere 扩展组件已经成功加载，您可以通过点击顶部导航栏菜单访问该扩展组件的页面。

![demo-plugin-dashboard.png](images/get-started/hello-world-extension-dashboard.png)