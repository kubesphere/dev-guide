---
title: Hello World 扩展组件
weight: 403
description: 创建第一个 KubeSphere 扩展组件
---

参照前面的章节准备好 KubeSphere 4.0 环境与本地开发环境之后就可以开始扩展组件的开发了，我们从一个简单的 demo 项目开始。

## 初始化扩展组件项目


1. 创建项目脚手架

在任意目录下执行下面命令(这里我们选择在`/root/lab/`下执行)：

```shell
yarn create ks-app my-app  # 在 my-app 目录下创建一个新的 ks-app
```

命令执行完成后，我们会在终端上看到如下输出：

```shell
Success! Created my-app at /Users/chenzhen/Workspace/lab/my-app
Inside that directory, you can run several commands:

  yarn create-plugin <plugin-name>
    Create a new plugin.

  yarn dev
    Starts the development server.

  yarn build:dll
    Builds the dll files.

  yarn build:prod
    Builds the app for production.

  yarn start
    Runs the built app in production mode.

We suggest that you begin by typing:

  cd my-app
  yarn create-plugin <plugin-name>

And

  yarn dev

✨  Done in 117.41s.
```

2. 创建 Hello World 扩展组件


```shell
$ yarn create:plugin
yarn run v1.22.10
$ ksc create:plugin
? Plugin Name demo
? Display Name Hello World!
? Description Hello World
? Author demo
? Language JavaScript
? Ensure to create plugin: [demo] ? Yes
✨  Done in 10.90s.
```
回车执行命令会进入交互式命令行界面。按照提示输入响应信息。
命令执行成功后，我们在 plugins 目录可以看到扩展组件的框架代码已经生成。目录结构如图：

![](images/pluggable-arch/plugin-directory.png)


## 扩展组件的运行与调试

1. 将 ks-apiserver 代理至本地


ks-core 与扩展组件开发过程依赖 ks-apiserver 提供的 API，需要通过 kubectl port-forward 将 ks-apiserver 这个 service 代理到本地开发环境

```
$ kubectl -n kubesphere-system port-forward service/ks-apiserver 8080:80
Forwarding from 127.0.0.1:8080 -> 9090
Forwarding from [::1]:8080 -> 9090
```

上述命令将 ks-apiserver 代理至本地 http://127.0.0.1:8080，您也可以替换命令行中的本地端口

2. 配置启动参数

编辑编辑扩展组件目录下配置文件 `configs/local_config.yaml`，修改 apiServer 为 kubectl 的代理地址：

```shell
server:
  apiServer:
    url: http://127.0.0.1:8080 # 注意: 端口需要与 port-forward 本地端口一致
    wsUrl: ws://127.0.0.1:8080
```

如目录所示，前端的开发与普通的 react app 开发基本无异。执行下面命令开启前端开发环境

```
$ yarn dev
yarn run v1.22.10
$ concurrently -k --raw 'yarn dev:client' 'yarn dev:server'
$ ksc dev
$ ksc-server
Dashboard app running at port 8000

✔ Webpack-bar
  Compiled successfully in 7.96s

<i> [webpack-dev-server] Project is running at:
<i> [webpack-dev-server] Loopback: http://localhost:8001/
<i> [webpack-dev-server] On Your Network (IPv4): http://172.31.188.223:8001/
<i> [webpack-dev-server] On Your Network (IPv6): http://[fe80::1]:8001/
<i> [webpack-dev-server] Content not from webpack is served from '/Users/hongming/WebProjects/my-app/dist' directory
<i> [webpack-dev-server] 404s will fallback to '/index.html'
Successfully started server on http://localhost:8000


 DONE  Compiled successfully in 7974ms                                                     18:41:15

webpack 5.74.0 compiled successfully in 7974 ms
No issues found.
```


到此为止，您的第一个 KubeSphere 扩展组件就已经成功运行，您可以在顶部导航栏看到该扩展组件的入口。

![demo-plugin-dashboard.png](images/pluggable-arch/demo-plugin-dashboard.png)