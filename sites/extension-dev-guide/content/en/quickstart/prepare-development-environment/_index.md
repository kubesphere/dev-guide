---
title: Build a Development Environment
weight: 1
description: 介绍如何搭建扩展组件的开发环境
---

This section describes how to build a development environment for extensions. Before you start, make sure KubeSphere Core and related development tools are installed.

* KubeSphere Core: the minimal core component of KubeSphere, which provides a basic runtime for extension development.

* Development tools: On your server, you need to install development tools such as create-ks-project and ksbuilder, and third-party tools such as Node.js, Helm, and kubectl. These tools are used to create a project, install dependencies, provide a runtime environment for extensions, and package and release extensions.


## Install KubeSphere Core


1. Log in to a server on which Kubernetes is installed, and run the following commands to install KubeSphere Core by using `Helm`:

   ```bash
   helm upgrade --install -n kubesphere-system --create-namespace ks-core https://charts.kubesphere.io/test/ks-core-0.3.1.tgz --set apiserver.nodePort=30881 --set global.tag=v4.0.0-beta.1 --debug --wait
   ```

   {{%expand "如果您还没有一个可用的 K8s 集群，您可以展开当前内容，通过以下方式快速创建一个 K8s 集群。" %}}

   ```bash
   curl -sfL https://get-kk.kubesphere.io | sh -
   ./kk create cluster --skip-pull-images --with-local-storage  --with-kubernetes v1.25.4 --container-manager containerd  -y
   ```

   {{% /expand%}}


2. Run the following command to check the pod status. When the pod status is `Running`, you can use the default account and password (admin/P@88w0rd) to access the KubeSphere web console through NodePort (IP:30880). You can also access KubeSphere API Server through NodePort (IP:30881).

   ```
   kubectl get pod -n kubesphere-system
   ```

   If the pod is not running properly and you cannot locate the problem, [submit an issue](https://github.com/kubesphere/kubesphere/issues) or [post the issue in the forum](https://kubesphere. io/forum/).


## Install development tools

1. You can install development tools on your own, or quickly get started with the tool provided by KubeSphere.

   {{< tabs >}}
   {{% tab name="Install binary files" %}}

Install development tools on the development host

1. Install [Node.js](https://nodejs.org/en/download/package-manager) v16.17 or later and [Yarn](https://classic.yarnpkg.com/lang/en/docs/install) v1.22 or later.

2. Install [Helm](https://helm.sh/docs/intro/install/) v3.8 or later and [kubectl](https://kubernetes.io/zh-cn/docs/tasks/tools/#kubectl) v1.23 or later.

2. Download [ksbuilder](https://github.com/kubesphere/ksbuilder/releases) to `/usr/local/bin`.

   {{% /tab %}}
{{% tab name="Run containers" %}}

您可以在容器中运行开发扩展组件所需的开发工具，执行以下命令为开发工具命令设置别名：

```bash
# Create a local cache and configuration file directory
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

2. Copy the [kubeconfig](https://kubernetes.io/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/) configuration file of the Kubernetes cluster to the development host to ensure that the cluster can be accessed by using kubectl.


   ```bash
   ➜  ~ kubectl -n kubesphere-system get po
   NAME                                     READY   STATUS    RESTARTS       AGE
   ks-apiserver-7c67b4577b-tqqmd            1/1     Running   0              10d
   ks-console-7ffb5954d8-qr8tx              1/1     Running   0              10d
   ks-controller-manager-758dc948f5-8n4ll   1/1     Running   0              10d
   ```
