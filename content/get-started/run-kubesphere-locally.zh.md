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

TBD

## 本地运行 KubeSphere 前端代码

TBD

