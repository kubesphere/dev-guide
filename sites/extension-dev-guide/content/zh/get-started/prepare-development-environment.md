---
title: 准备本地开发环境
weight: 402
description: 准备本地开发环境
---

在完成 KubeSphere 4.0 的部署之后，请参照以下步骤准备本地开发环境：


## 安装 kubectl 命令行工具

1. 将访问 Kubernetes 集群所用到的 kubeconfig 文件复制到本地开发环境

您需要将 KubeSphere 部署环境中 `~/.kube/config` 文件复制到本地开发环境中 `~/.kube/config` 路径下。以 scp 命令为例：

```
scp root@172.31.73.180:~/.kube/config ~/.kube/config
```

2. 确保 kubeconfig 文件中 server 地址可以在本地访问

您需要借助 vpn，端口转发，反向代理等方式将 kube-apiserver 的地址暴露到本地开发环境。 请参考 https://kubernetes.io/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/

例：使用 KubeKey 安装的 K8s 环境中，kubeconfig 中 server 地址默认配置为 https://lb.kubesphere.local:6443，本地环境中可以通过 172.31.73.180:6443 端口访问到 kube-apiserver，则需要修改本地开发环境 hosts 将 lb.kubesphere.local 域名解析指向 172.31.73.180，这样可以确保通过 kubeconfig 中 server 证书校验。

```bash
echo "172.31.73.180  lb.kubesphere.local" | sudo tee -a /etc/hosts
```

3. 开发环境中安装 kubectl 工具

- [Install kubectl on Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux)
- [Install kubectl on macOS](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos)
- [Install kubectl on Windows](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows)

4. 验证

在本地开发环境中执行以下命令确保 K8s 集群可以正常连接，正常情况下该命令可以返回 K8s 集群中的节点列表。

```
➜  ~ kubectl get no
NAME       STATUS   ROLES                         AGE     VERSION
allinone   Ready    control-plane,master,worker   4h38m   v1.23.7
```

## 安装 KubeSphere 扩展组件开发工具与依赖

KubeSphere 扩展组件的开发依赖 [ksbuilder](https://github.com/kubesphere/ksbuilder)、[helm](https://github.com/helm/helm) 命令行工具，您可以参考以下步骤进行安装。

### 安装 ksbuilder 命令行工具

ksbuidler 是一个命令行工具，可以帮助我们快速搭建 KubeSphere 扩展组件开发脚手架，帮助我们打包、发布扩展组件。

* Linux 系统下安装：

访问 `ksbuilder` 的 [github release 页面](https://github.com/kubesphere/ksbuilder/releases)，下载适配自己系统的最新的版本，解压安装。

```shell
$ wget https://github.com/kubesphere/ksbuilder/releases/download/v0.0.1-alpha2/ksbuilder_0.0.1-alpha2_linux_amd64.tar.gz
$ tar -xzf ksbuilder_0.0.1-alpha2_linux_amd64.tar.gz
$ sudo mv ksbuilder /usr/local/bin/ksbuilder
```

* macOS 系统下可以使用 `homebrew` 运行如下命令安装：

```shell
// 新增 brew 私有仓
brew tap kubesphere/tap
// 安装
brew install kubesphere/tap/ksbuilder
```

安装完成后在终端工具中执行 `ksbuilder version` 看到返回的版本号信息即代表安装成功。如：

```
$ ksbuilder version
0.0.1-alpha2
```

### 安装 Helm

扩展组件的打包、发布过程依赖 helm 进行编排，请参考 [Helm 官方文档](https://helm.sh/docs/intro/install/)进行安装。

在完成安装后执行以下命令检查安装是否成功：

```bash
$ helm version
version.BuildInfo{Version:"v3.6.3", GitCommit:"d506314abfb5d21419df8c7e7e68012379db2354", GitTreeState:"clean", GoVersion:"go1.16.5"}
```

### 安装 Node.js 与 yarn

扩展组件前端开发依赖 `Node.js` 和 `yarn`，请参考下面文档进行安装。

- 安装 Node.js [Active LTS Release](https://nodejs.org/en/about/releases/)
  方法:
   - 使用 `nvm` (推荐)
      - [安装 nvm](https://github.com/nvm-sh/nvm#install--update-script)
      - [使用 nvm 安装和切换 Node 版本](https://nodejs.org/en/download/package-manager/#nvm)
   - [安装包安装](https://nodejs.org/en/download/)
- `yarn` [安装教程](https://yarnpkg.com/getting-started/install)
