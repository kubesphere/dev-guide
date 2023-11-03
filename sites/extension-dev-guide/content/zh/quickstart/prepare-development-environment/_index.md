---
title: 搭建开发环境
weight: 01
description: 介绍如何搭建扩展组件的开发环境
---

本节介绍如何搭建扩展组件开发环境。为搭建开发环境，您需要安装 KubeSphere Core 和开发工具。

* KubeSphere Core：KubeSphere 最小化核心组件，为扩展组件开发提供基础的运行环境。

* 开发工具： [create-ks-project](https://github.com/kubesphere/create-ks-project) 和 [ksbuilder](https://github.com/kubesphere/create-ks-project) 用于扩展组件项目的初始化、打包和发布，以及常用的开发工具 Node.js、Helm、kubectl 等等。

## 安装 KubeSphere Core

1. 登录到 K8s 集群的主机中，执行以下命令通过 `helm` [安装 KubeSphere Core](https://docs.kubesphere.com.cn/v4.0/03-install-and-uninstall/01-install-ks-core)：

   ```bash
   helm upgrade --install -n kubesphere-system --create-namespace ks-core  https://charts.kubesphere.io/main/ks-core-0.4.0.tgz --set apiserver.nodePort=30881 --debug --wait
   ```

   如果您还没有一个可用的 K8s 集群，可以通过 [KubeKey](https://github.com/kubesphere/kubekey) 快速创建。

   ```bash
   curl -sfL https://get-kk.kubesphere.io | sh -
   ./kk create cluster --skip-pull-images --with-local-storage  --with-kubernetes v1.25.4 --container-manager containerd  -y
   ```

2. 执行以下命令检查 Pod 状态，当 Pod 状态都为 `Running` 时，您可以通过 NodePort (IP:30880) 使用默认帐户和密码 (admin/P@88w0rd) 访问 KubeSphere Console，还可以通过 NodePort (IP:30881) 访问 KubeSphere API Server。

   ```bash
   kubectl get pod -n kubesphere-system
   ```

   如果 Pod 无法正常运行，您无法定位问题，欢迎[提交 issue](https://github.com/kubesphere/kubesphere/issues) 或[论坛发帖](https://kubesphere.io/forum/)进行反馈，我们很乐意协助您！

## 安装开发工具

1. 您需要安装以下开发工具：

   * 安装 [Node.js](https://nodejs.org/en/download/package-manager) v16.17+ 和 [Yarn](https://classic.yarnpkg.com/lang/en/docs/install) v1.22+。

   * 安装 [Helm](https://helm.sh/docs/intro/install/) v3.8+ 和 [kubectl](https://kubernetes.io/zh-cn/docs/tasks/tools/#kubectl) v1.23+。

   * 下载 [ksbuilder](https://github.com/kubesphere/ksbuilder/releases) 并保存到 `/usr/local/bin` 目录。

2. 复制 K8s 集群的 [kubeconfig](https://kubernetes.io/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/) 配置文件到开发主机上，确保使用 kubectl 可以正常访问到 K8s 集群。

   ```bash
   ➜  ~ kubectl -n kubesphere-system get po
   NAME                                     READY   STATUS    RESTARTS       AGE
   ks-apiserver-7c67b4577b-tqqmd            1/1     Running   0              10d
   ks-console-7ffb5954d8-qr8tx              1/1     Running   0              10d
   ks-controller-manager-758dc948f5-8n4ll   1/1     Running   0              10d
   ```
