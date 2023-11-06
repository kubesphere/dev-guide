---
title: 搭建开发环境
weight: 01
description: 介绍如何搭建扩展组件的开发环境
---

本节介绍如何搭建扩展组件开发环境。搭建开发环境，需要安装 KubeSphere Enterprise 和相应的开发工具。

* KubeSphere Enterprise：在 K8s 集群中部署 KubeSphere Enterprise Helm Chart ，为扩展组件提供基础的运行环境。
* 开发工具： [create-ks-project](https://github.com/kubesphere/create-ks-project) 和 [ksbuilder](https://github.com/kubesphere/create-ks-project) 用于扩展组件项目的初始化、打包和发布，以及常用的开发工具 Node.js、Helm、kubectl 等。

## 安装 KubeSphere Enterprise

1. 准备 Kubernetes 集群

   KubeSphere Enterprise 可以安装在任何 Kubernetes 集群上，可以使用 [KubeKey](https://github.com/kubesphere/kubekey) 部署 K8s 集群。

   ```bash
   curl -sfL https://get-kk.kubesphere.io | sh -
   ./kk create cluster --skip-pull-images --with-local-storage  --with-kubernetes v1.25.4 --container-manager containerd  -y
   ```

   在 K8s 集群中[安装 Helm](https://helm.sh/zh/docs/intro/install/)

   ```bash
   curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
   ```

2. 安装 KubeSphere Enterprise Helm Chart

   ```bash
   helm upgrade --install -n kubesphere-system --create-namespace ks-core  https://charts.kubesphere.io/main/ks-core-0.4.0.tgz --set apiserver.nodePort=30881 --debug --wait
   ```

   更多配置参数，请参考 [安装 KubeSphere 企业版](https://docs.kubesphere.com.cn/v4.0/03-install-and-uninstall/01-install-ks-core/#_%E9%AB%98%E7%BA%A7%E9%85%8D%E7%BD%AE)。

## 安装开发工具

1. 安装开发扩展组件所需的开发工具：

   * `Node.js` 和 `Yarn` 用于扩展组件的前端开发：安装 [Node.js](https://nodejs.org/en/download/package-manager) v16.17+ 和 [Yarn](https://classic.yarnpkg.com/lang/en/docs/install) v1.22+。
   * `Helm` 和 `kubectl` 用于扩展组件的编排和 K8s 集群管理： 安装 [Helm](https://helm.sh/docs/intro/install/) v3.8+ 和 [kubectl](https://kubernetes.io/zh-cn/docs/tasks/tools/#kubectl) v1.23+。
   * `ksbuilder` 用于扩展组件的打包与发布： 下载 [ksbuilder](https://github.com/kubesphere/ksbuilder/releases) 并保存到可执行文件目录。

2. 开发环境配置

   复制 K8s 集群的 [kubeconfig](https://kubernetes.io/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/) 配置文件到开发主机上，确保使用 kubectl 可以正常访问到 K8s 集群。

   ```bash
   ➜  ~ kubectl -n kubesphere-system get po
   NAME                                     READY   STATUS    RESTARTS       AGE
   ks-apiserver-7c67b4577b-tqqmd            1/1     Running   0              10d
   ks-console-7ffb5954d8-qr8tx              1/1     Running   0              10d
   ks-controller-manager-758dc948f5-8n4ll   1/1     Running   0              10d
   ```
