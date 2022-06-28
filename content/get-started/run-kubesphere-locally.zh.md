---
title: 本地运行 KubeSphere
weight: 101
description: 引导您在本地运行 KubeSphere 代码
---

## 前提条件

* `Git`: KubeSphere 的源代码托管在 GitHub 仓库中。您需要先[安装 Git](https://git-scm.com/downloads)。
* `Go`: KubeSphere 后端是一个 Golang 项目。在此之前您需要先[准备 Go 1.16 开发环境](https://go.dev/doc/install)。
* `Node`: KubeSphere 前端项目通过 Javascript 编写，您需要[安装 Node 12.18](https://nodejs.dev/download/) 或更高版本。
* `Yarn`: KubeSphere 前端项目使用 Yarn 作为包管理工具，您需要安装 [Yarn 1.22.4](https://classic.yarnpkg.com/lang/en/docs/install/) 或更高版本。
* `Docker`（可选）: KubeSphere 借助 Docker 构建镜像，如果您只是想在本地环境中测试和运行，则无需安装 Docker，您也可以参考本文档[安装 Docker](https://docs.docker.com/get-docker/)。
* `Make`（可选）：KubeSphere 使用 Makefile 帮助减少复杂工作，这不是必须的。
* `Kubernetes`：KubeSphere 依赖 Kubernetes 提供的 API，您可以借助 [KubeKey](https://github.com/kubesphere/kubekey) 在远程环境或本地[安装 Kubernetes 1.19](https://github.com/kubesphere/kubekey#create-a-cluster)或更高版本

{{% notice note %}}
KubeSphere 可以在 Windows 10 中构建和运行. 但是，它预计不会被部署在 Windows 系统中, 您可能会遇到很多兼容性问题。为了获得更好的体验，我们建议您先[安装 WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10)。
{{% /notice %}}

## 克隆代码

首先您需要通过 Git 克隆 KubeSphere 的[前端](https://github.com/kubesphere/console)与[后端](https://github.com/kubesphere/kubesphere)代码：

```bash
git clone https://github.com/kubesphere/kubesphere.git
git clone https://github.com/kubesphere/console.git
```

## 本地运行 KubeSphere 后端代码

### 准备

#### 配置文件
Kubesphere 使用 [viper](https://github.com/spf13/viper) 管理和加载配置。在开始运行之前，您需要在本地创建一个配置文件以供程序加载。
在集群中部署完 kubesphere 之后会生成一个 configmap 配置字典。 您可以执行以下命令查看

```bash
kubectl -n kubesphere-system get cm kubesphere-config -o yaml
```

复制 "kubesphere.yaml" 键的值。作为后续的配置文件的输入

Kubesphere 会在以下路径中加载配置文件
- Linux 根目录下 /etc/kubesphere.yaml
- Kubesphere 代码根目录下 kubesphere.yaml

在以上任意一个路径中，使用上述 configmap 中的值，创建配置文件 kubesphere.yaml 以提供给 Kubesphere 运行时加载。

#### K8s集群
Kubesphere 在运行时会加载本地 K8s 集群的 kubeconfig 文件，如果您想使用远端集群，可以使用远端集群中的 kubeconfig ，在本地 root 目录下创建 .kube/config，以供程序运行时加载。

### 运行 ks-apiserver
在 kubesphere 代码根目录下运行 
```bash
go run cmd/ks-apiserver/apiserver.go
```

### 运行 ks-controller-manager
在 kubesphere 代码根目录下运行
```bash
go run cmd/controller-manager/controller-manager.go
```

## 本地运行 KubeSphere 前端代码

TBD

