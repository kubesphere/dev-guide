---
title: 搭建开发环境
weight: 01
description: 介绍如何搭建扩展组件开发环境。
---

本节介绍如何搭建扩展组件开发环境。为搭建开发环境，您需要安装 KubeSphere Core 和开发工具。

* KubeSphere Core：KubeSphere 最小化核心组件，为扩展组件开发提供基础的运行环境。

* 开发工具：您需要在开发主机上安装 KubeSphere 团队提供的 create-ks-project 和 ksbuilder 等开发工具，以及 Node.js、Helm、kubectl 等第三方工具。 开发工具用于创建扩展组件开发项目、安装依赖、为扩展组件提供运行环境以及对扩展组件进行打包发布。


## 安装 KubeSphere Core


1. 登录到 K8s 集群的主机中，执行以下命令通过 `helm` 安装 KubeSphere Core：

   ```bash
   git clone https://github.com/kubesphere/helm-charts.git
   helm upgrade --install -n kubesphere-system --create-namespace ks-core ./helm-charts/src/test/ks-core --set apiserver.nodePort=30881 --set global.tag=ksc --set apiserver.image.pullPolicy=Always --set console.image.pullPolicy=Always  --set controller.image.pullPolicy=Always  --debug
   ```

   {{%expand "如果您还没有一个可用的 K8s 集群，您可以展开当前内容，通过以下方式快速创建一个 K8s 集群" %}}

   ```bash
   curl -sfL https://get-kk.kubesphere.io | sh -
   ./kk create cluster --skip-pull-images --with-local-storage  --with-kubernetes v1.25.4 --container-manager containerd  -y
   ```

   {{% /expand%}}


2. 执行以下命令检查 Pod 状态，当 Pod 状态都为 `Running` 时，您可以通过 NodePort (IP:30880) 使用默认帐户和密码 (admin/P@88w0rd) 访问 KubeSphere Console，还可以通过 NodePort (IP:30881) 访问 KubeSphere API Server。

   ```
   kubectl get pod -n kubesphere-system
   ```

   如果 Pod 无法正常运行，您无法定位问题，欢迎[提交 issue](https://github.com/kubesphere/kubesphere/issues) 或[论坛发帖](https://kubesphere.io/forum/)进行反馈，我们很乐意协助您！


## 安装开发工具

1. 您可以自行安装相关的开发工具，或者使用 KubeSphere 团队提供的工具容器快速体验。

   {{< tabs >}}
   {{% tab name="安装二进制文件" %}}

执行以下步骤在开发主机上安装开发工具：

1. 安装 [Node.js](https://nodejs.org/en/download/package-manager) v16.17+ 和 [Yarn](https://classic.yarnpkg.com/lang/en/docs/install) v1.22+。

2. 安装 [Helm](https://helm.sh/docs/intro/install/) v3.8+ 和 [kubectl](https://kubernetes.io/zh-cn/docs/tasks/tools/#kubectl) v1.23+。

2. 下载 [ksbuilder](https://github.com/kubesphere/ksbuilder/releases) 并保存到 `/usr/local/bin` 目录。

   {{% /tab %}}
{{% tab name="使用容器" %}}

您可以在容器中运行扩展组件开发所需的开发工具，执行以下命令为开发工具命令设置别名：

```bash
# 创建本地缓存与配置文件目录
mkdir -p ~/.kubesphere/.yarn ~/.kubesphere/.config && touch ~/.kubesphere/.yarnrc
alias yarn='docker run --rm -e YARN_CACHE_FOLDER=/.yarn/cache --user $(id -u):$(id -g) -v $PWD:$PWD -v ~/.kubesphere/.yarnrc:/.yarnrc -v ~/.kubesphere/.yarn:/.yarn -v ~/.kubesphere/.config:/.config -w $PWD -p 8000:8000 -p 8001:8001 -it kubespheredev/dev-tools:v4.0.0-alpha.1 yarn'
```


```bash
alias kubectl='docker run --rm -v ~/.kube/config:/root/.kube/config -v $PWD:$PWD -w $PWD -it kubespheredev/dev-tools:v4.0.0-alpha.1 kubectl'
```

```bash
alias ksbuilder='docker run --rm --user $(id -u):$(id -g) -v ~/.kube/config:/tmp/kubeconfig -e KUBECONFIG=/tmp/kubeconfig -v $PWD:$PWD -w $PWD -it kubespheredev/dev-tools:v4.0.0-alpha.1 ksbuilder'
```

   {{% /tab %}}
   {{< /tabs >}}

2. 复制 K8s 集群的 [kubeconfig](https://kubernetes.io/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/) 配置文件到开发主机上，确保使用 kubectl 可以正常访问到 K8s 集群。


   ```bash
   ➜  ~ kubectl -n kubesphere-system get po
   NAME                                     READY   STATUS    RESTARTS       AGE
   ks-apiserver-7c67b4577b-tqqmd            1/1     Running   0              10d
   ks-console-7ffb5954d8-qr8tx              1/1     Running   0              10d
   ks-controller-manager-758dc948f5-8n4ll   1/1     Running   0              10d
   ```
