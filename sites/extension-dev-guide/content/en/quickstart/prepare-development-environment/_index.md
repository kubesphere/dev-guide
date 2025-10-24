---
title: Build a Development Environment
weight: 1
description: Describes how to build a development environment for extensions.
---

This section describes how to build a development environment for extensions. Before you start, make sure KubeSphere and related development tools are installed.

* KubeSphere: Deploy KubeSphere in a K8s cluster to provide a base runtime environment for extensions.

* Development tools: Install [create-ks-project](https://github.com/kubesphere/create-ks-project) and [ksbuilder](https://github.com/kubesphere/ksbuilder) for initializing the extension project, packaging and publishing extensions, and you may need these development tools Node.js, Helm, kubectl, etc.


## Install KubeSphere

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

2. Install KubeSphere

   ```bash
   chart=oci://hub.kubesphere.com.cn/kse/ks-core
   version=1.2.2
   helm upgrade --install -n kubesphere-system --create-namespace ks-core $chart --debug --wait --version $version --set apiserver.nodePort=30881 --reset-values
   ```

   More content can be found in [Online Installation of Kubernetes and KubeSphere](https://docs.kubesphere.co/v4.2.0/03-installation-and-upgrade/02-install-kubesphere/01-online-install-kubernetes-and-kubesphere/).

3. Activate KubeSphere

   Apply for a free KubeSphere Community Edition license [here](https://kubesphere.co/apply-license/), and complete the [activation](https://docs.kubesphere.co/v4.2.0/03-installation-and-upgrade/02-install-kubesphere/03-activate-ks/) after importing the license.

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
