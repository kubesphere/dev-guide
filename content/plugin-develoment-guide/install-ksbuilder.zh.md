---
title: 安装 ksbuilder 插件管理 CLI
weight: 401
description: 安装 ksbuilder 插件管理 CLI
---

在进行具体的插件业务代码开发前，我们首先要新建一个插件管理工程。这个工程的作用主要是用来负责插件的调试、发布、卸载等工作。

## 安装

1. 安装准备

在[前面章节](/zh/plugin-develoment-guide/deploy-kubesphere-4.0/#准备开发环境)中我们已经在本地配置好了 `kubeconfig` 并且安装了 `kubectl`。
接下来在安装 `ksbuilder` 前我们需要在本地安装 `helm`，安装教程请点击链接[安装 helm](https://helm.sh/docs/intro/install/).


2. 安装 ks-builder 命令行工具

* Linux 系统下安装：
点击访问 `ksbuilder` 的 [github release 页面](https://github.com/kubesphere/ksbuilder/releases)，下载适配自己系统的最新的版本，解压安装。
具体命令如下：
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

## 使用
1. 新建插件管理工程
   
执行 `ksbuilder init <poject-direcotry>` 新建工程目录，比如我们在 `/root/lab` 目录下执行如下命令：

```shell
$ ksbuilder init plugin-repo
Directory: /root/lab/plugin-repo

The project has been created.
```
可以看到工程成功的创建在 `/root/lab/plugin-repo` 目录下。

2. 创建插件目录

工程创建成功后，如果我们要进行某个插件的开发还需要创建一个插件目录。比如我们在 `/root/lab/plugin-repo` 目录下创建一个 demo 插件目录，命令如下：
```shell 
$ ks-builder create
Please input plugin name:  demo
Input: demo
Please input plugin description:  This is demo plugin
Input: This is demo plugin
Use the arrow keys to navigate: ↓ ↑ → ←
? What category does demo belong to?:
+   Other
  ▸ Performance
    Monitoring
    Logging
    Messaging
```
如上，输入命令回车后我们会进入命令行交互模式。按照提示依次输入插件名称、描述和所属分类后，回车即可创建出插件目录。内容如下:


```
|____Chart.yaml
|____charts
| |____frontend
| | |____Chart.yaml
| | |____templates
| | | |____deployment.yaml
| | | |____NOTES.txt
| | | |____tests
| | | | |____test-connection.yaml
| | | |____service.yaml
| | | |____extensions.yaml
| | | |____helps.tpl
| | |____values.yaml
| |____backend
| | |____Chart.yaml
| | |____templates
| | | |____deployment.yaml
| | | |____NOTES.txt
| | | |____tests
| | | | |____test-connection.yaml
| | | |____service.yaml
| | | |____extensions.yaml
| | | |____helps.tpl
| | |____values.yaml
|____.helmignore
|____values.yaml
```

可以看出，插件的管理是基于 helm chart 的。在`/root/lab/plugin-repo/demo/charts`目录中有 frontend 和 backend 两个 subchart,可以分别配置前端和后端的 helm chart。

3. 配置插件

此步骤建议您对 `k8s`、`helm` 有一定了解并阅读 [可插拔介绍](/zh/understand-kubesphere/pluggable/backend-pluggable-architecture/).

如上面所示的目录结构，在插件的根目录下有一个 `values.yaml` 文件，在这个文件中配置插件前后端镜像(当然，前提是前后端代码已准备好并打包好了镜像，如何打包请参考后面章节)。

```yaml
image:
  frontend:
    repository: registry.cn-hangzhou.aliyuncs.com/demo-frontend
    tag: latest
  backend:
    repository: registry.cn-hangzhou.aliyuncs.com/demo-backend
    tag: latest
```

配置好后，即可执行插件的安装命令。如果您想对插件有更详细的配置，可在 charts 目录的 frontend 和 backend 目录下进行具体配置。


4. 安装、更新与卸载

配置好后，以上面的 demo 插件为示例，在插件管理工程根目录 `/root/lab/plugin-repo/` 下执行如下命令：

```shell
$ ks-builder install demo
```
即可将插件部署到集群中

执行
```shell
$ ks-builder upgrade demo
```
即可将插件更新插件

执行
```shell
$ ks-builder uninstall demo
```
即可将插件从集群中卸载

上面我们讲解了插件的创建、配置、安装、更新、卸载这些操作的方法和命令，下面我们会以一个实例更详细的讲解插件的开发。
