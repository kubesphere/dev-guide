---
title: 搭建开发环境
weight: 402
description: 介绍如何搭建扩展组件开发环境。
---

本节介绍如何搭建扩展组件开发环境。为搭建开发环境，您需要下载 `kubesphere` 和 `dev-tools` 这两个 Docker 容器：

* `kubesphere`：运行 KubeSphere Core，即 KubeSphere 的核心组件，用于为扩展组件提供 API 服务。`kubesphere` 容器可以运行在本地主机上，也可以运行在远程主机上以避免本地主机资源占用过高。

* `dev-tools`：提供扩展组件开发工具链，包括 [create-ks-ext](/extension-dev-guide/zh/references/create-ks-ext/)、[ksbuilder](/extension-dev-guide/zh/references/ksbuilder/) 等开发工具和 Node.js、Helm 等第三方组件，用于初始化扩展组件开发项目、安装依赖、为扩展组件提供运行环境以及对扩展组件进行打包。保存在本地主机上的扩展组件源代码文件将挂载到 `dev-tools` 容器中，并在 `dev-tools` 容器中运行和测试。`dev-tools` 容器必须在本地主机上运行。

### 前提条件

您需要提前在开发主机上安装 Docker。有关更多信息，请参阅 [Docker 官方文档](https://docs.docker.com/engine/install/)。

### 安装 KubeSphere Core

1. 登录本地主机或远程主机，执行以下命令快速在容器中安装 KubeSphere Core，同时暴露前端服务 ks-console 访问端口 30880 和 后端服务 ks-apiserver 访问端口 30881：

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

您可以采用以下两种方式安装开发工具链：

* 设置命令别名：在本地主机上为开发工具命令设置别名，使开发工具命令自动在 `dev-tools` 容器中运行，并根据开发工具命令的运行和终止自动创建和删除 `dev-tools` 容器。

* 连接 IDE：在本地主机上持续运行 `dev-tools` 容器，将 IDE 连接到 `dev-tools` 容器中，通过 IDE 在 `dev-tools` 容器中调用开发工具。

{{< tabs >}}
{{% tab name="设置命令别名" %}}

登录本地主机，执行以下命令为开发工具命令设置别名：

```bash
alias yarn='touch $PWD/.yarnrc && docker run --rm -e YARN_CACHE_FOLDER=/.yarn/cache --user $(id -u):$(id -g) -v $PWD:$PWD -v $PWD/.yarnrc:/.yarnrc -v $PWD/.yarn:/.yarn -v $PWD/.config:/.config -w $PWD -p 8000:8000 -p 8001:8001 -it kubespheredev/dev-tools:v0.0.1 yarn'
```

```bash
alias kubectl='docker run --rm -v ~/workspace/kubesphere/config:/root/.kube/config -v $PWD:$PWD -w $PWD -it kubespheredev/dev-tools:v0.0.1 kubectl'
```

```bash
alias ksbuilder='docker run --rm --user $(id -u):$(id -g) -v ~/workspace/kubesphere/config:/root/.kube/config -v $PWD:$PWD -w $PWD -it kubespheredev/dev-tools:v0.0.1 ksbuilder'
```

{{% /tab %}}
{{% tab name="连接 IDE" %}}

以下介绍如何使用 VS Code 连接 `dev-tools` 容器。如果您使用其他 IDE，请参阅 IDE 的官方文档。

1. 登录本地主机，执行以下命令创建 `dev-tools` 容器：

   ```bash
   docker run -d --name dev-tools -v ~/workspace/kubesphere/config:/root/.kube/config -v ~/workspace/kubesphere:/workspace/kubesphere -w /workspace/kubesphere -p 8000:8000 -p 8001:8001 kubespheredev/dev-tools:v0.0.1
   ```

2. 打开 VS Code 并[安装 Remote - Containers 扩展](https://code.visualstudio.com/docs/remote/containers-tutorial)。

3. 打开 VS Code 命令面板，输入 `attach to running container`，在搜索结果中选择 `Remote-Containers: Attach to Running Container`，然后选择 `dev-tools` 容器。

   ![attach-to-running-container.png](images/get-started/attach-to-running-container.png?width=1080px)

4. 打开 VS Code 终端。您可以在 VS Code 终端调用开发工具。

   ![dev-tools.png](images/get-started/dev-tools.png?width=1080px)

{{% /tab %}}
{{< /tabs >}}