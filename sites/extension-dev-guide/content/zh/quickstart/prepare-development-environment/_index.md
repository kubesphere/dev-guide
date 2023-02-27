---
title: 搭建开发环境
weight: 01
description: 介绍如何搭建扩展组件开发环境。
---

本节介绍如何搭建扩展组件开发环境。为搭建开发环境，您需要安装 KubeSphere Core 和开发工具。

* KubeSphere Core：KubeSphere 的核心组件，为扩展组件提供 API 服务。

* 开发工具：您需要在开发主机上安装 KubeSphere 团队提供的 create-ks-ext 和 ksbuilder 等开发工具，以及 Node.js、Helm、kubectl 等第三方工具。 开发工具用于创建扩展组件开发项目、安装依赖、为扩展组件提供运行环境以及对扩展组件进行打包发布。


## 安装 KubeSphere Core


1. 登录可以访问 K8s 集群的主机中，执行以下命令通过 `helm` 安装 KubeSphere Core：

   ```
   helm repo add test https://charts.kubesphere.io/test
   helm repo update test
   helm install -n kubesphere-system --create-namespace ks-core test/ks-core --set apiserver.nodePort=30881
   ```

2. 检查 Pod 状态是否为 `Running`：

   ```
   kubectl get pod -n kubesphere-system
   ```

3. 当 Pod 状态都为 `Running` 时，可以通过 NodePort (IP:30880) 使用默认帐户和密码 (admin/P@88w0rd) 访问 Web 控制台。

   {{%expand "如果 ks-apiserver 未正常运行，您可以展开当前内容，执行以下命令查看日志进行排查。" %}}

   * 执行以下命令查看 `ks-apiserver` pod 日志：

      ```
      kubectl -n kubesphere-system logs deploy/ks-apiserver
      ```

   {{% /expand%}}



## 安装开发工具

为简化工具安装，KubeSphere 团队已将上述工具构建成容器镜像，您可以通过运行容器快速安装工具。如果您的开发主机上已经安装部分第三方工具，您也可以在开发主机上运行KubeSphere 团队提供的工具容器或者以安装二进制文件的方式安装其他工具。

1. 复制 K8s 集群 master 节点的 kubeconfig 配置文件到开发主机上，您可以登录master节点执行以下命令：

   ```bash
   mkdir -p ~/.kubesphere/dev-tools && cp /etc/kubernetes/admin.conf ~/.kubesphere/dev-tools/config
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
