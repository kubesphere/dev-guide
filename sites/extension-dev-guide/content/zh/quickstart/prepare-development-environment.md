---
title: 搭建开发环境
weight: 01
description: 介绍如何搭建扩展组件开发环境。
---

本节介绍如何搭建扩展组件开发环境。为搭建开发环境，您需要安装 KubeSphere Core 和开发工具。

* KubeSphere Core：KubeSphere 的核心组件，为扩展组件提供 API 服务。KubeSphere 团队已将 KubeSphere Core 构建成容器镜像，您可以通过运行容器快速安装 KubeSphere Core。

* 开发工具：您需要在开发主机上安装 KubeSphere 团队提供的 create-ks-ext 和 ksbuiler 等开发工具，以及 Node.js、Helm、kubectl 等第三方工具。开发工具用于创建扩展组件开发项目、安装依赖、为扩展组件提供运行环境以及打包发布扩展组件。为简化工具安装，KubeSphere 团队已将上述工具构建成容器镜像，您可以通过运行容器快速安装工具。同时，如果您的开发主机上已经安装部分第三方工具，您也可以在开发主机上以安装二进制文件的方式安装工具。

### 前提条件

您需要提前在开发主机上安装 Docker。有关更多信息，请参阅 [Docker 官方文档](https://docs.docker.com/engine/install/)。

### 安装 KubeSphere Core

1. 登录开发主机，执行以下命令通过运行 `kubesphere` 容器安装 KubeSphere Core，同时暴露前端 Web 控制台服务 `ks-console` 访问端口 30880、后端 API 服务 `ks-apiserver` 访问端口 30881 以及 K8s kube-apiserver 的访问端口 6443：

    ```
    docker run -d --name kubesphere --privileged=true --restart=always -p 30881:30881 -p 30880:30880 -p 6443:6443 kubespheredev/ksc-allinone:v4.0.0-alpha.1
    ```

2. 容器正常运行并且状态为 `healthy` 之后，执行以下命令检查 `ks-apiserver` 是否运行正常：

   ```bash
   curl -s http://localhost:30881/kapis/version
   ```

   如果显示以下信息，则表明 `ks-apiserver` 运行正常：
   ```json
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
   }
   ```

   {{%expand "如果 ks-apiserver 未正常运行，您可以展开当前内容，执行以下命令查看日志进行排查。" %}}

   * 执行以下命令查看 K3s 日志：

     ```bash
     docker logs -f kubesphere
     ```

   * 执行以下命令查看 KubeSphere 安装日志：

     ```bash
     docker exec kubesphere tail -f -n +1 nohup.out
     ```

   * 执行以下命令查看 pod 运行状态：

     ```
     docker exec kubesphere kubectl get po -A
     ```

   * 执行以下命令查看 `ks-apiserver` pod 日志：

     ```
     docker exec kubesphere kubectl -n kubesphere-system logs deploy/ks-apiserver
     ```

   如果您无法解决发现的问题，[请向 KubeSphere 开源社区提交 issue](https://github.com/kubesphere/kubesphere/issues/new?assignees=&labels=kind%2Fbug&template=bug_report.md)。

{{% /expand%}}


### 安装开发工具

1. 执行以下命令在开发主机上创建开发工具的配置文件夹，将 `kubesphere` 容器中的 kubeconfig 配置文件复制到本地文件夹中：


   ```bash
   mkdir -p ~/.kubesphere/dev-tools && docker cp kubesphere:/etc/rancher/k3s/k3s.yaml ~/.kubesphere/dev-tools/config
   ```

2. 根据您的开发习惯，通过运行容器或安装二进制文件安装开发工具。

   {{< tabs >}}
   {{% tab name="运行容器" %}}

在开发主机上为开发工具命令设置别名，使开发工具命令自动在 `dev-tools` 容器中运行，并根据开发工具命令的运行和终止自动运行和删除 `dev-tools` 容器。

登录开发主机，执行以下命令为开发工具命令设置别名：

```bash
# 创建本地缓存与配置文件目录
mkdir -p ~/.kubesphere/.yarn ~/.kubesphere/.config && touch ~/.kubesphere/.yarnrc
alias yarn='docker run --rm -e YARN_CACHE_FOLDER=/.yarn/cache --user $(id -u):$(id -g) -v $PWD:$PWD -v ~/.kubesphere/.yarnrc:/.yarnrc -v ~/.kubesphere/.yarn:/.yarn -v ~/.kubesphere/.config:/.config -w $PWD -p 8000:8000 -p 8001:8001 -it kubespheredev/dev-tools:v4.0.0-alpha.1 yarn'
```


```bash
# 替换 kubeconfig 中 kube-apiserver 的访问地址
perl -pi -e "s/127.0.0.1/`docker inspect --format '{{ .NetworkSettings.IPAddress }}' kubesphere`/g" ~/.kubesphere/dev-tools/config
alias kubectl='docker run --rm -v ~/.kubesphere/dev-tools/config:/root/.kube/config -v $PWD:$PWD -w $PWD -it kubespheredev/dev-tools:v4.0.0-alpha.1 kubectl'
```

```bash
alias ksbuilder='docker run --rm --user $(id -u):$(id -g) -v ~/.kubesphere/dev-tools/config:/tmp/kubeconfig -e KUBECONFIG=/tmp/kubeconfig -v $PWD:$PWD -w $PWD -it kubespheredev/dev-tools:v4.0.0-alpha.1 ksbuilder'
```

   {{% /tab %}}
   {{% tab name="安装二进制文件" %}}

执行以下步骤在开发主机上安装开发工具：

1. 登录开发主机，安装 Node.js v16.17.0、Yarn v1.22.19、Helm v3.8+. 和 kubectl v1.23+。有关更多信息，请访问 [Node.js 官方网站](https://nodejs.org/en/)、[Yarn 官方网站](https://yarnpkg.com)、[Helm 官方网站](https://helm.sh) 和 [Kubernetes 官方网站](https://kubernetes.io/docs/tasks/tools/)。

2. [下载 ksbuilder 最新版本](https://github.com/kubesphere/ksbuilder/releases)并保存到开发主机 `/usr/local/bin` 目录。

   {{% /tab %}}
   {{< /tabs >}}
