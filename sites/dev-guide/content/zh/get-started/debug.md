---
title: 代码调试
weight: 105
description: 调试编写的代码
---

## 代码调试

Kubesphere默认运行在本地集群中。如果您需要在集群中debug，可以使用 telepresence，Telepresence 可以让您的程序在本地运行，但是可以接受集群中的其他组件的请求。

#### 安装和使用 telepresence

安装 [Telepresence Install](https://www.telepresence.io/docs/latest/install)

连接集群
```bash
telepresence connect
```

```bash
telepresence intercept ks-apiserver -n kubesphere-system --port 9090:9090 --env-file ./api.config
```
执行成功后，会在当前目录下生成 api.config 配置文件，如果您使用 GoLand 调试，可以安装插件 [EnvFile](https://plugins.jetbrains.com/plugin/7861-envfile) 
在运行时加载此配置文件

#### Windows 环境下调试
如果您在 Windows 环境下调试程序，可以在 Windows WSL 中安装 Telepresence。 在 Windows 环境中使用 GoLand 使程序在 WSL 中调试程序

打开窗口右上角Run Configuration

添加运行环境

![debug1](/images/get-started/debug1.png)

![debug2](/images/get-started/debug2.png)

确认WSL为运行环境

![debug3](/images/get-started/debug3.png)

### ks-apiserver

运行调试


