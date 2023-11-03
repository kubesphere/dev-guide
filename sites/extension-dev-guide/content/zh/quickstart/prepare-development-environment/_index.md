---
title: 搭建开发环境
weight: 01
description: 介绍如何搭建扩展组件的开发环境
---

本节介绍如何搭建扩展组件开发环境。搭建开发环境，需要安装 KubeSphere Core 和相应的开发工具。

* KubeSphere Core：KubeSphere 最小化核心组件，为扩展组件开发提供基础的运行环境。

* 开发工具：在开发主机上安装 KubeSphere 团队提供的 create-ks-project 和 ksbuilder 等开发工具，以及 Node.js、Helm、kubectl 等第三方工具。这些开发工具用于创建扩展组件开发项目、安装依赖、为扩展组件提供运行环境，以及对扩展组件进行打包和发布。

## 安装 KubeSphere Core


1. 登录到 K8s 集群的主机中，执行以下命令通过 `helm` 安装 KubeSphere Core：

   ```bash
   helm upgrade --install -n kubesphere-system --create-namespace ks-core  https://charts.kubesphere.io/main/ks-core-0.4.0.tgz --set apiserver.nodePort=30881 --debug --wait
   ```

   {{%expand "如果您还没有一个可用的 K8s 集群，请展开当前内容，通过以下方式快速创建一个 K8s 集群。" %}}

   ```bash
   curl -sfL https://get-kk.kubesphere.io | sh -
   ./kk create cluster --skip-pull-images --with-local-storage  --with-kubernetes v1.25.4 --container-manager containerd  -y
   ```

   {{% /expand%}}


2. 执行以下命令检查 Pod 状态，当 Pod 状态都为 `Running` 时，就可以通过 NodePort (IP:30880) 使用默认账户和密码 (admin/P@88w0rd) 访问 KubeSphere Console，还可以通过 NodePort (IP:30881) 访问 KubeSphere API Server。

   ```
   kubectl get pod -n kubesphere-system
   ```

   如果 Pod 无法正常运行，而您无法确定问题所在，欢迎[提交 issue](https://github.com/kubesphere/kubesphere/issues) 或者在[论坛发帖](https://kubesphere.io/forum/)进行反馈，我们将为您提供协助！


## 安装开发工具

1. 安装以下开发工具：

   - 安装 [Node.js](https://nodejs.org/en/download/package-manager) v16.17+ 和 [Yarn](https://classic.yarnpkg.com/lang/en/docs/install) v1.22+。

   - 安装 [Helm](https://helm.sh/docs/intro/install/) v3.8+ 和 [kubectl](https://kubernetes.io/zh-cn/docs/tasks/tools/#kubectl) v1.23+。

   - 下载 [ksbuilder](https://github.com/kubesphere/ksbuilder/releases) 并保存到 `/usr/local/bin` 目录。

2. 复制 K8s 集群的 [kubeconfig](https://kubernetes.io/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/) 配置文件到开发主机上，确保使用 kubectl 可以正常访问 K8s 集群。


   ```bash
   ➜  ~ kubectl -n kubesphere-system get po
   NAME                                     READY   STATUS    RESTARTS       AGE
   ks-apiserver-7c67b4577b-tqqmd            1/1     Running   0              10d
   ks-console-7ffb5954d8-qr8tx              1/1     Running   0              10d
   ks-controller-manager-758dc948f5-8n4ll   1/1     Running   0              10d
   ```
