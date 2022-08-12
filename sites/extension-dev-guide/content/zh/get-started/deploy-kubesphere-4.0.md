---
title: 部署 KubeSphere 4.0
weight: 401
description: 部署 KubeSphere 4.0
---

在开始之前，您需要准备一个 Kubernetes 集群并安装 KubeSphere 4.0 作为开发测试环境。

## 准备 Kubernetes 集群

借助 [KubeKey](https://github.com/kubesphere/kubekey)，可以快速的创建一个 Kubernetes 集群，您也可以使用 kubeadm，k3s 等工具。

首先您需要准备一台虚拟机并安装[满足要求的 Linux 发行版](https://github.com/kubesphere/kubekey#linux-distributions)，本示例将借助 KubeKey 创建一个单节点 Kubernetes 环境。

1. 下载 KubeKey

登录到您准备好的虚拟机，通过以下命令获取 KubeKey，您也可以通过 [Release 页面](https://github.com/kubesphere/kubekey/releases)直接下载 KubeKey 二进制文件。

```
curl -sfL https://get-kk.kubesphere.io | sh -
```

2. 安装依赖

[KubeKey 依赖 conntrack、socat](https://github.com/kubesphere/kubekey#requirements-and-recommendations)，检出 KubeSphere 需要用到 git，我们需要提前进行安装，以 Ubuntu 为例：

```
apt update && apt install conntrack socat git -y
```

{{% notice note %}}
KubeKey 会自动安装后文中出现的 kubectl、helm 等工具，如果您使用其他方式安装 Kubernetes，请自行安装。 
{{% /notice %}}

3. 创建 Kubernetes 集群

```bash
./kk create cluster --with-kubernetes v1.23.7 -y
```

4. 验证 Kubenertes 部署是否完成

看到以下日志表示 Kubernetes 安装成功

```
Installation is complete.

Please check the result using the command:

	kubectl get pod -A
```

通过以下命令来检查集群是否就绪

```
kubectl get pod -A
```

集群中所有的 Pod 正常 Running 表示集群处于可用状态

```bash
NAMESPACE     NAME                                       READY   STATUS    RESTARTS   AGE
kube-system   calico-kube-controllers-785fcf8454-5wb5j   1/1     Running   0          6m42s
kube-system   calico-node-q9g2s                          1/1     Running   0          6m42s
kube-system   coredns-757cd945b-6clqw                    1/1     Running   0          6m43s
kube-system   coredns-757cd945b-78jk6                    1/1     Running   0          6m43s
kube-system   kube-apiserver-allinone                    1/1     Running   0          6m56s
kube-system   kube-controller-manager-allinone           1/1     Running   0          6m59s
kube-system   kube-proxy-jjfbt                           1/1     Running   0          6m44s
kube-system   kube-scheduler-allinone                    1/1     Running   0          7m4s
kube-system   nodelocaldns-gxhtj                         1/1     Running   0          6m44s
```

Kubenetes 命令行工具 kubectl 的使用，请参考 https://kubernetes.io/zh-cn/docs/reference/kubectl/

## 安装 ks-core

目前 KubeSphere 4.0 还处于开发状态，您需要登录到 Kuberntes 集群，通过以下步骤将 KubeSphere 代码克隆到本地，并通过 Helm 安装 ks-core。

1. 克隆 KubeSphere 代码

```bash
git clone https://github.com/kubesphere/kubesphere.git
```

2. 检出 `feature-pluggablee` 分支

```
cd kubesphere
git checkout feature-pluggable
```

4. 安装 ks-core

```
pushd config
# 安装 CRD
kubectl apply -f crds
# 创建 namespace
kubectl create ns kubesphere-system 
kubectl create ns kubesphere-controls-system
# 安装 ks-core
helm upgrade --install ks-core ./ks-core/ --namespace kubesphere-system \
--set image.ks_apiserver_repo=kubespheredev/ks-apiserver \
--set image.ks_apiserver_tag=feature-pluggable \
--set image.ks_controller_manager_repo=kubespheredev/ks-controller-manager \
--set image.ks_controller_manager_tag=feature-pluggable \
--set image.ks_console_repo=kubespheredev/ks-console \
--set image.ks_console_tag=feature-pluggable
```

{{% notice note %}}
通过 `--set` 命令设置 ks-core 所用到的的 image repo 和 tag，您也可以选择 [本地构建 ks-core 的镜像](https://kubesphere-dev-guide.netlify.app/dev-guide/zh/get-started/build-docker-image/)。
{{% /notice %}}

Helm 命令行工具的使用请参考 https://helm.sh/zh/docs/intro/using_helm/

5. 验证安装

出现以下日志表示 ks-core 安装成功

```
Release "ks-core" has been upgraded. Happy Helming!
NAME: ks-core
LAST DEPLOYED: Mon Jul 25 18:38:33 2022
NAMESPACE: kubesphere-system
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

通过以下命令检查 ks-core 是否正常运行，所有 Pod 都应该是 Running 状态

```
kubectl -n kubesphere-system get po
```

通过虚拟机（本示例中虚拟机 IP 为172.31.73.180） 30880 端口可以访问到 KubeSphere 前端界面

```
➜  ~ curl 172.31.73.180:30880 -v
*   Trying 172.31.73.180...
* TCP_NODELAY set
* Connected to 172.31.73.180 (172.31.73.180) port 30880 (#0)
> GET / HTTP/1.1
> Host: 172.31.73.180:30880
> User-Agent: curl/7.64.1
> Accept: */*
>
< HTTP/1.1 302 Found
< Vary: Accept-Encoding
< Location: /login
< Content-Type: text/html; charset=utf-8
< Content-Length: 43
< Date: Mon, 25 Jul 2022 10:50:31 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
* Connection #0 to host 172.31.73.180 left intact
Redirecting to <a href="/login">/login</a>.* Closing connection 0
```

至此，KubeSphere 4.0 的安装已经完成。