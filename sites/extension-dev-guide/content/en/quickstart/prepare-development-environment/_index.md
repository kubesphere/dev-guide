---
title: Build a Development Environment
weight: 1
description: Describes how to build a development environment for extensions.
---

This section describes how to build a development environment for extensions. Before you start, make sure KubeSphere Luban and related development tools are installed.

* KubeSphere Luban: Deploy KubeSphere Luban Helm Chart in a K8s cluster to provide a base runtime environment for extensions.

* Development tools: Install [create-ks-project](https://github.com/kubesphere/create-ks-project) and [ksbuilder](https://github.com/kubesphere/ksbuilder) for initializing the extension project, packaging and publishing extensions, and you may need these development tools Node.js, Helm, kubectl, etc.


## Install KubeSphere Luban

1. Create a Kubernetes Cluster

   KubeSphere Luban can be installed on any Kubernetes cluster. Please deploy a Kubernetes cluster with [KubeKey](https://github.com/kubesphere/kubekey).

   ```bash
   curl -sfL https://get-kk.kubesphere.io | sh -
   ./kk create cluster --with-local-storage  --with-kubernetes v1.31.0 --container-manager containerd  -y
   ```

   [Install Helm](https://helm.sh/zh/docs/intro/install/) in your Kubernetes cluster.

   ```bash
   curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
   ```

2. Install KubeSphere Luban Helm Chart.

   ```bash
   helm upgrade --install -n kubesphere-system --create-namespace ks-core  https://charts.kubesphere.io/main/ks-core-1.1.0.tgz --set apiserver.nodePort=30881 --debug --wait
   ```

For more configuration, refer to [KubeSphere Helm Chart Configurations](https://docs.kubesphere.com.cn/v4.0/03-install-and-uninstall/01-install-ks-core/#_%E9%AB%98%E7%BA%A7%E9%85%8D%E7%BD%AE)。


## Install development tools

In addition to setting up the environment for K8s and KubeSphere Luban, the following tools are needed on the development host.

1. Install the following development tools
  
   * `Node.js` and `Yarn` for frontend development of extensions: install [Node.js](https://nodejs.org/en/download/package-manager) v16.17+ and [Yarn](https://classic.yarnpkg.com/lang/en/docs/install) v1.22+.
   * `Helm` and `kubectl` for extensions orchestration and K8s cluster management: install [Helm](https://helm.sh/docs/intro/install/) v3.8+ and [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) v1.23+.
   * `ksbuilder` for packaging and publishing extensions: Download [ksbuilder](https://github.com/kubesphere/ksbuilder/releases) and install it to `/usr/local/bin`.
  
2. Configure the development environment

   Copy the [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file of the K8s cluster to the development host, and make sure the K8s cluster can be properly accessed using kubectl.

   ```bash
   ➜  ~ kubectl -n kubesphere-system get po
   NAME                                     READY   STATUS    RESTARTS       AGE
   ks-apiserver-7c67b4577b-tqqmd            1/1     Running   0              10d
   ks-console-7ffb5954d8-qr8tx              1/1     Running   0              10d
   ks-controller-manager-758dc948f5-8n4ll   1/1     Running   0              10d
   ```

   If you are using a cluster created on [KubeSphere Cloud](https://kubesphere.cloud/sign-up/), download the kubeconfig file from the location shown below:

   <img src="./kubeconfig.png" alt="kubeconfig" style="zoom:50%;" />