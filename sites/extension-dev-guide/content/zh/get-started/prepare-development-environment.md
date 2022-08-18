---
title: 准备开发环境
weight: 402
description: 介绍如何安装一个 All in One 的 KubeSphere 示例扩展组件运行环境和一个容器化的本地开发工具。
---

在开始之前，您需要准备一个 Kubernetes 集群并安装 KubeSphere 4.0 的扩展组件运行环境。为了简化安装，我们提供了 KubeSphere All-in-One 容器镜像，您可以选择在本地或远程环境中进行部署。

无论何种部署方式，您首先需要安装好 Docker 或其他兼容 OCI 的容器引擎，下文将以 Docker 为例。

### 安装 Docker 

非桌面环境请参考：[Install Docker Engine](https://docs.docker.com/engine/install/)

桌面环境请参考：[Install Docker Desktop](https://docs.docker.com/desktop/)

### 通过 Docker 部署 KubeSphere All-in-One

通过以下命令可以快速创建一个 KubeSphere All-in-One 环境。

{{< tabs >}}
{{% tab name="本地环境" %}}

```bash
docker run -d --name kubesphere --privileged=true --restart=always kubespheredev/ks-allinone:v4.0.0-alpha.0
```

{{% /tab %}}
{{% tab name="远程环境" %}}

```bash
docker run -d --name kubesphere --privileged=true --restart=always -p 30881:30881 kubespheredev/ks-allinone:v4.0.0-alpha.0
```

{{% /tab %}}
{{< /tabs >}}

{{% notice note %}}
如果是在远程环境中部署 KubeSphere，需要在容器启动命令中指定 `-p 30881:30881` 参数，如上面命令所示，目的是将 ks-apiserver 对应的 30881 端口暴露，确保在开发环境中可以访问到该端口。
{{% /notice %}}

容器正常运行之后，可以通过 KubeSphere 容器 IP:30881 访问到 ks-apiserver，通过下述命令验证 ks-apiserver 服务是否正常。

```bash
$ docker exec -it kubesphere wget -qO- http://`docker inspect --format '{{ .NetworkSettings.IPAddress }}' kubesphere`:30881/kapis/version
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

{{%expand "如果您的服务出现异常，可以展开当前内容，通过以下命令查看相关日志，进行排查。" %}}

查看 K3s 日志
```bash
docker logs -f kubesphere
```

查看 KubeSphere 部署日志
```bash
docker exec kubesphere tail -f -n +1 nohup.out
```

查看 pod 运行状态

```
docker exec kubesphere kubectl get po -A
```

查看 ks-apiserver pod 日志

```
docker exec kubesphere kubectl -n kubesphere-system logs deploy/ks-apiserver
```

如果您无法解决发现的问题，欢迎向我们[提交 issue](https://github.com/kubesphere/kubesphere/issues/new?assignees=&labels=kind%2Fbug&template=bug_report.md)。

{{% /expand%}}


### 通过 Docker 创建容器化的本地开发环境

KubeSphere 扩展组件的开发用到了一些开发工具（[create-ks-ext](/extension-dev-guide/zh/references/create-ks-ext/)，[ksbuilder](/extension-dev-guide/zh/references/ksbuilder/)）和依赖（Node.js、Helm 等），我们同样把这些工具打包成一个镜像方便快速搭建开发环境。

在开始之前我们需要创建一个本地文件目录用作数据持久化，用来保存项目文件。

```bash
mkdir -p ~/workspace/kubesphere
```

保存 kubesphere 集群的 kubeconfig 到本地，并配置 kube-apiserver 的地址与端口。

```
$ docker cp kubesphere:/etc/rancher/k3s/k3s.yaml ~/workspace/kubesphere/config
$ sed -i '' "s/127.0.0.1/`docker inspect --format '{{ .NetworkSettings.IPAddress }}' kubesphere`/g" ~/workspace/kubesphere/config
```

{{% notice note %}}
Linux 下 sed 命令需要去掉紧跟在 sed -i 后面的 `''`。
{{% /notice %}}

您可以根据习惯选择使用 Shell 命令行（可以使用 Shell Aliases 简化命令行） 或者 VS Code Remote - Containers 扩展连接到开发环境容器中执行后文中的命令行操作。

{{< tabs >}}
{{% tab name="Shell Aliases" %}}

```bash
$ alias yarn='docker run --rm --user $(id -u):$(id -g) -v $PWD:$PWD -w $PWD -p 8000:8000 -p 8001:8001 -it kubespheredev/dev-tools:v0.0.1 yarn'
$ alias kubectl='docker run --rm -v ~/workspace/kubesphere/config:/root/.kube/config -v $PWD:$PWD -w $PWD -it kubespheredev/dev-tools:v0.0.1 kubectl'
```

{{% /tab %}}
{{% tab name="VS Code Remote - Containers" %}}

您可以很方便的[使用 VS Code 在容器中进行开发](https://code.visualstudio.com/docs/remote/containers)，首先您需要[安装 Remote - Containers 扩展](https://code.visualstudio.com/docs/remote/containers-tutorial)。

1. 通过 Docker 启动开发环境

```bash
docker run -d --name dev-tools -v ~/workspace/kubesphere/config:/root/.kube/config -v ~/workspace/kubesphere:/workspace/kubesphere -w /workspace/kubesphere -p 8000:8000 -p 8001:8001 kubespheredev/dev-tools:v0.0.1
```

2. Attach to Running Container 选择 dev-tools 容器

![attach-to-running-container.png](images/get-started/attach-to-running-container.png)

3. 打开 `/workspace/kubesphere` 目录

![open-folder.png](images/get-started/open-folder.png)

4. 打开终端

![dev-tools.png](images/get-started/dev-tools.png)

{{% /tab %}}
{{< /tabs >}}