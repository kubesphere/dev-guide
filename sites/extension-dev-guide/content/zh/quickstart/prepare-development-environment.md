---
title: 搭建开发环境
weight: 01
description: 介绍如何搭建扩展组件开发环境。
---

本节介绍如何搭建扩展组件开发环境。为搭建开发环境，您只需要使用 Docker 运行 `kubesphere` 和 `dev-tools` 两个容器：

* `kubesphere`：运行 KubeSphere Core，即 KubeSphere 的核心组件，用于为扩展组件提供 API 服务。

* `dev-tools`：提供扩展组件开发工具链，包括 [create-ks-ext](zh/references/create-ks-ext/)、[ksbuilder](zh/references/ksbuilder/) 等开发工具和 Node.js、Helm 等第三方组件，用于初始化扩展组件开发项目、安装依赖、为扩展组件提供运行环境以及对扩展组件进行打包。保存在开发主机上的扩展组件源代码文件将挂载到 `dev-tools` 容器中，并在 `dev-tools` 容器中运行和测试。

### 前提条件

您需要提前在开发主机上安装 Docker。有关更多信息，请参阅 [Docker 官方文档](https://docs.docker.com/engine/install/)。

### 安装 KubeSphere Core

1. 登录开发主机，执行以下命令快速在容器中安装 KubeSphere Core，同时暴露前端 Web 控制台服务 `ks-console` 访问端口 30880 和后端 API 服务 `ks-apiserver` 访问端口 30881：

    ```
    docker run -d --name kubesphere --privileged=true --restart=always -p 30881:30881 -p 30880:30880 kubespheredev/ks-allinone:v4.0.0-alpha.0
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


### 安装开发工具链

1. 执行以下命令将会创建本地开发工具的配置文件夹，并将 `kubesphere` 容器中的 kubeconfig 配置文件复制到文件夹中，然后在配置文件中设置 Kubernetes API 服务 `kube-apiserver` 的访问地址：

   ```bash
   mkdir -p ~/.kubesphere/dev-tools
   ```

   ```bash
   docker cp kubesphere:/etc/rancher/k3s/k3s.yaml ~/.kubesphere/dev-tools/config
   ```

   ```bash
   perl -pi -e "s/127.0.0.1/`docker inspect --format '{{ .NetworkSettings.IPAddress }}' kubesphere`/g" ~/.kubesphere/dev-tools/config
   ```

2. 根据您的开发习惯，通过设置命令别名或连接 IDE 安装开发工具链：

   {{< tabs >}}
   {{% tab name="设置命令别名" %}}

   在开发主机上为开发工具命令设置别名，使开发工具命令自动在 `dev-tools` 容器中运行，并根据开发工具命令的运行和终止自动运行和删除 `dev-tools` 容器。

   登录开发主机，执行以下命令为开发工具命令设置别名：

   ```bash
   alias yarn='mkdir -p ~/.kubesphere/.yarn ~/.kubesphere/.config && touch ~/.kubesphere/.yarnrc && docker run --rm -e YARN_CACHE_FOLDER=/.yarn/cache --user $(id -u):$(id -g) -v $PWD:$PWD -v ~/.kubesphere/.yarnrc:/.yarnrc -v ~/.kubesphere/.yarn:/.yarn -v ~/.kubesphere/.config:/.config -w $PWD -p 8000:8000 -p 8001:8001 -it kubespheredev/dev-tools:latest yarn'
   ```

   ```bash
   alias kubectl='docker run --rm -v ~/.kubesphere/dev-tools/config:/root/.kube/config -v $PWD:$PWD -w $PWD -it kubespheredev/dev-tools:latest kubectl'
   ```

   ```bash
   alias ksbuilder='docker run --rm --user $(id -u):$(id -g) -v ~/.kubesphere/dev-tools/config:/root/.kube/config -v $PWD:$PWD -w $PWD -i kubespheredev/dev-tools:latest ksbuilder'
   ```

   {{% /tab %}}
   {{% tab name="连接 IDE" %}}

   在开发主机上持续运行 `dev-tools` 容器，将 IDE 连接到 `dev-tools` 容器中，通过 IDE 在 `dev-tools` 容器中调用开发工具。
   
   以下介绍如何使用 VS Code 连接 `dev-tools` 容器。如果您使用其他 IDE，请参阅 IDE 的官方文档。

   1. 登录开发主机，执行以下命令创建 `dev-tools` 容器：

      ```bash
      docker run -d --name dev-tools -v ~/.kubesphere/dev-tools/config:/root/.kube/config -v ~/kubesphere-extensions:/kubesphere-extensions -w /kubesphere-extensions -p 8000:8000 -p 8001:8001 kubespheredev/dev-tools:latest
      ```

   2. 打开 VS Code 并[安装 Remote - Containers 扩展](https://code.visualstudio.com/docs/remote/containers-tutorial)。

   3. 打开 VS Code 命令面板，输入 `attach to running container`，在搜索结果中选择 `Remote-Containers: Attach to Running Container`，然后选择 `dev-tools` 容器。

      ![attach-to-running-container.png](images/zh/get-started/attach-to-running-container.png?width=1080px)

   4. 打开 VS Code 终端。您可以在 VS Code 终端调用开发工具。

      ![dev-tools.png](images/zh/get-started/dev-tools.png?width=1080px)

   {{% /tab %}}
   {{< /tabs >}}