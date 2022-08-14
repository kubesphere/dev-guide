---
title: 准备本地开发环境
weight: 402
description: 准备本地开发环境
---

在开始之前，您需要准备一个 Kubernetes 集群并安装 KubeSphere 4.0 用作开发集成。

### 安装 Docker 

请参考以下文档在您的开发环境中安装好 Docker：

* [Install Docker Desktop on Mac](https://docs.docker.com/desktop/install/mac-install/)
* [Install Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/)
* [Install Docker Desktop on Linux](https://docs.docker.com/desktop/install/linux-install/)


### 创建 KubeSphere All-in-One 集群

执行下述命令，将在您的地开发环境中使用 Docker 运行一个 K3s 单节点环境并通过 Helm 部署 KubeSphere 4.0。 可以直接使用我们事先构建好的 All-in-One 容器镜像 `kubespheredev/ks-quickstart:v0.0.1` 快速完成部署。

在开始之前我们需要创建一个本地文件目录用作数据持久化与文件共享。

```
$ mkdir -p ~/Workspace/kubesphere
```

紧接着通过 Docker 创建 KubeSphere 4.0 单节点环境，容器名称 kubesphere。

```bash
$ docker run -d --name kubesphere --privileged=true --restart=always -v ~/Workspace/kubesphere:/Workspace/kubesphere \
     kubespheredev/ks-quickstart:v0.0.1 \
     server --cluster-init --disable-cloud-controller --disable=servicelb,traefik,metrics-server --write-kubeconfig=/Workspace/kubesphere/kubeconfig --write-kubeconfig-mode=644 --tls-san=kubesphere
$ docker exec kubesphere /bin/sh /kubesphere/bootstrap.sh
```

成功部署您将看到以下提示信息：

```bash
Release "ks-core" does not exist. Installing it now.
NAME: ks-core
LAST DEPLOYED: Sun Aug 14 17:18:11 2022
NAMESPACE: kubesphere-system
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Please wait for several seconds for KubeSphere deployment to complete.

1. Make sure KubeSphere components are running:

     kubectl get pods -n kubesphere-system

2. Then you should be able to visit the console NodePort:

     Console: http://172.17.0.2:30880

3. To login to your KubeSphere console:

     Account: admin
     Password: P@88w0rd
     NOTE: Please change the default password after login.

For more details, please visit https://kubesphere.io.
```

### 通过 Docker 创建容器化的开发环境

KubeSphere 与扩展组件的开发用到了许多开发工具（Node.js、Helm、ksbuilder等），为了方便您快速熟悉这个过程，节约您环境配置的时间，我们提供了一个  All-in-One 的容器镜像作为示例，您可以很方便的[使用 VS Code 在容器中进行开发](https://code.visualstudio.com/docs/remote/containers)。

1. 通过 Docker 启动开发环境，容器名称 dev-workspace。

```
docker run -d --name dev-workspace -v ~/Workspace/kubesphere:/Workspace/kubesphere -p 8000:8000 -p 8001:8001 --link kubesphere kubespheredev/dev-workspace:v0.0.1
```

{{% notice note %}}
注意挂载部署 KubeSphere 时使用的本地目录，以实现数据的共享。
{{% /notice %}}


2. 使用 VS Code 并安装 Remote - Containers 扩展

参考该教程：[https://code.visualstudio.com/docs/remote/containers-tutorial](https://code.visualstudio.com/docs/remote/containers-tutorial)

3. 使用  VS Code 打开容器开发环境中的文件目录

Attach to Running Container 选择 dev-workspace 容器

![attach-to-running-container.png](images/get-started/attach-to-running-container.png)

![open-folder.png](images/get-started/open-folder.png)

![dev-workspace.png](images/get-started/dev-workspace.png)

至此 KubeSphere 扩展组件的本地开发环境就已经准备就绪。