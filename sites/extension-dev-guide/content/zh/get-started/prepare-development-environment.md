---
title: 准备开发环境
weight: 402
description: 准备开发环境
---

在开始之前，您需要准备一个 Kubernetes 集群并安装 KubeSphere 4.0 用作开发集成。为了简化安装部署的过程，我们提供了 KubeSphere All-in-One 容器镜像，您可以选择在本地或远程环境中进行部署。

无论何种部署方式，您首先需要安装好 Docker 或其他兼容 OCI 的容器引擎，下文将以 Docker 为例。

### 安装 Docker 

桌面环境请参考：

* [Install Docker Desktop on Mac](https://docs.docker.com/desktop/install/mac-install/)
* [Install Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/)
* [Install Docker Desktop on Linux](https://docs.docker.com/desktop/install/linux-install/)

非桌面环境请参考：

* [Install Docker Engine](https://docs.docker.com/engine/install/)

### 通过 Docker 部署 KubeSphere All-in-One

我们事先将 KubeSphere 部署所依赖的环境及工具打包为一个 All-in-One 容器镜像 `docker.io/kubespheredev/ks-quickstart:v0.0.1`

通过以下命令可以快速创建一个 KubeSphere All-in-One 环境

```bash
$ docker run -d --name kubesphere --privileged=true --restart=always \
     kubespheredev/ks-quickstart:v0.0.1 \
     server --cluster-init --disable-cloud-controller --disable=servicelb,traefik,metrics-server --write-kubeconfig-mode=644 --tls-san=kubesphere
$ docker exec kubesphere /bin/sh /kubesphere/bootstrap.sh # 部署 KubeSphere
$ docker exec kubesphere kubectl -n kubesphere-system patch svc ks-apiserver --type='json' -p '[{"op":"replace","path":"/spec/type","value":"NodePort"},{"op":"replace","path":"/spec/ports/0/nodePort","value":30881}]' # 设置 ks-apiserver 为 NodePort 类型并指定端口为 30881
```

{{% notice note %}}
如果是在远程环境中部署 KubeSphere，您需要在容器启动命令中指定 `-p 30881:30881` 参数，将 ks-apiserver 对应的 30881 端口暴露，确保在开发环境中可以访问到该端口。
{{% /notice %}}

成功部署您将看到以下提示信息

```bash
Release "ks-core" does not exist. Installing it now.
NAME: ks-core
LAST DEPLOYED: Sun Aug 14 17:18:11 2022
NAMESPACE: kubesphere-system
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Please wait for several seconds for KubeSphere deployment to complete.

1. Make sure KubeSphere components are running:

     kubectl get pods -n kubesphere-system

2. Then you should be able to visit the console NodePort:

     Console: http://172.17.0.2:30880

3. To login to your KubeSphere console:

     Account: admin
     Password: P@88w0rd
     NOTE: Please change the default password after login.

For more details, please visit https://kubesphere.io.
```

可以通过 kubesphere 容器IP:30881 访问到 ks-apiserver，通过下述命令验证 ks-apiserver 服务是否正常：

```bash
$ docker exec -it kubesphere wget -qO- http://172.17.0.2:30881/kapis/version
{
 "gitVersion": "v3.3.0-40+c5e2c55ba72765-dirty",
 "gitMajor": "3",
 "gitMinor": "3+",
 "gitCommit": "c5e2c55ba7276566150b72b5e2e88130bb83ad7c",
 "gitTreeState": "dirty",
 "buildDate": "2022-07-28T08:32:18Z",
 "goVersion": "go1.18.4",
 "compiler": "gc",
 "platform": "linux/amd64",
 "kubernetes": {
  "major": "1",
  "minor": "23",
  "gitVersion": "v1.23.9+k3s1",
  "gitCommit": "f45cf3267307b153ed8b418ae5b8ea6c6b9ebaca",
  "gitTreeState": "clean",
  "buildDate": "2022-07-19T00:42:17Z",
  "goVersion": "go1.17.5",
  "compiler": "gc",
  "platform": "linux/amd64"
 }
}%
```

### 通过 Docker 创建容器化的开发环境

KubeSphere 与扩展组件的开发用到了许多开发工具（Node.js、Helm、ksbuilder等），为了方便您快速熟悉这个过程，节约您环境配置的时间，我们提供了一个同样提供了一个 All-in-One 的容器镜像来提供这些工具。

在开始之前我们需要创建一个本地文件目录用作数据持久化，用来保存项目文件。

```bash
$ mkdir -p ~/Workspace/kubesphere
```

保存 kubesphere 集群的 kubeconfig 到本地，并配置 kube-apiserver 的地址与端口。

```
$ docker cp kubesphere:/etc/rancher/k3s/k3s.yaml ~/Workspace/kubesphere/config
$ sed -i '' "s/127.0.0.1/172.17.0.2/g" ~/Workspace/kubesphere/config
```