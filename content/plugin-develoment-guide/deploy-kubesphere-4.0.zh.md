---
title: 部署 KubeSphere 4.0 开发环境
weight: 400
description: 部署 KubeSphere 4.0 开发环境
---

在开始之前，您需要准备一个 Kubernetes 集群并安装 ks-core。


{{% notice note %}}
区别于 KubeSphere 3.x，这里 ks-core 特指 KubeSphere 4.0 版本的 Helm Chart。
{{% /notice %}}


## 准备 Kubernetes 集群

借助 [KubeKey](https://github.com/kubesphere/kubekey)，可以快速的创建一个 Kubernetes 集群，您也可以使用 kubeadm，k3s 等工具。

首先您需要准备一台虚拟机并安装[满足要求的 Linux 发行版](https://github.com/kubesphere/kubekey#linux-distributions)，本示例将借助 KubeKey 创建一个单节点 Kubernetes 环境。

1. 下载 KubeKey

登录到您准备好的虚拟机，通过以下命令获取 KubeKey，您也可以通过 [Release 页面](https://github.com/kubesphere/kubekey/releases)直接下载 KubeKey 二进制文件。

```
curl -sfL https://get-kk.kubesphere.io | sh -
```

2. 安装依赖

[KubeKey 依赖 conntrack、socat](https://github.com/kubesphere/kubekey#requirements-and-recommendations)，我们需要提前进行安装，以 Ubuntu 为例：

```
apt update && apt install conntrack socat -y
```

3. 创建 Kubernetes 集群

```bash
./kk create cluster --with-kubernetes v1.23.7 -y
```

4. 验证

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

## 安装 ks-core

目前 KubeSphere 4.0 还处于开发状态，您需要登录到您的虚拟机，通过以下步骤将 KubeSphere 代码克隆到本地，通过 Helm 安装 ks-core

1. 克隆 KubeSphere 代码

```bash
git clone https://github.com/kubesphere/kubesphere.git
```

2. 检出 feat-pluggable 分支

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
通过 --set 命令设置 ks-core 所用到的的 image repo 和 tag，您也可以[本地直接构建 ks-core 的镜像](../get-started/build-docker-image/)。
{{% /notice %}}

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

通过以下命令检查 ks-core 是否正常 Running

```
kubectl -n kubesphere-system get po
```

通过虚拟机（本示例中虚拟机ip为172.31.73.180） 30880 端口可以访问到 KubeSphere 前端界面，通过 curl 或者浏览器进行验证

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

## 准备开发环境

1. 将访问 Kubernetes 集群所用到的 kubeconfig 文件复制到本地开发环境

您需要将虚拟机中 `~/.kube/config` 文件复制到开发环境中 `~/.kube/config` 路径下。以 scp 命令为例：

```
scp root@172.31.73.180:~/.kube/config ~/.kube/config
```

2. 确保 kubeconfig 文件中 server 可以在开发环境中访问

您可以借助 vpn，端口转发等方式将 kubeconfig 中 kube-apiserver 的地址暴露到本地开发环境

如果 kubeconfig 中 server 地址为域名，您需要添加一条 hosts 将 kubeconfig 中的 server 域名指向您本地环境可访问的 kube-apiserver 的 ip 地址

例：kubeconfig 中 server 地址为 https://lb.kubesphere.local:6443，本地环境中可以通过 172.31.73.180:6443 端口访问到 kube-apiserver，则需要添加以下 hosts

```bash
echo "172.31.73.180  lb.kubesphere.local" | sudo tee -a /etc/hosts
```

3. 开发环境中安装 kubectl 工具

- [Install kubectl on Linux](/docs/tasks/tools/install-kubectl-linux)
- [Install kubectl on macOS](/docs/tasks/tools/install-kubectl-macos)
- [Install kubectl on Windows](/docs/tasks/tools/install-kubectl-windows)

4. 验证

在本地开发环境中执行以下命令确保 K8s 集群可以正常连接

```
kubectl get no
```

正常情况下该命令可以返回 K8s 集群中的节点列表

```
➜  ~ kubectl get no
NAME       STATUS   ROLES                         AGE     VERSION
allinone   Ready    control-plane,master,worker   4h38m   v1.23.7
```