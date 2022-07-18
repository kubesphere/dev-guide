---
title: 初始化插件项目
weight: 401
description: 初始化一个插件项目
---

在进行具体的前后端代码开发前，我们首先要新建一个插件管理工程。这个工程的作用主要是用来负责插件的调试、发布、卸载等工作。

> 前置条件：本地已配置 kube config 并安装了 helm

## 安装 ks-builder 命令行工具
* macOS 系统下使用 `homebrew` 运行如下命令安装：
```
// 新增 brew 私有仓
brew tap chenz24/tap
// 安装
brew install chenz24/tap/ks-builder
```

* Linux 系统下安装：
暂略

## 创建插件管理工程
执行如下命令初始化工程：
``` 
// 初始化工程，在想要安装的目录运行，poject-direcotry 为指定的目录名
ks-builder init <poject-direcotry>

// 创建插件目录
cd poject-direcotry // 切换到工程目录内
ks-builder create // 运行命令并按照提示输入信息
```
输入命令回车后进入命令行提示界面，如下图：
![](/images/plugin-arch/ks-builder-cli.png)

按照命令行提示依次输入插件名称、描述和所属分类后，回车即可创建出插件目录。内容如下：

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

可以看出，插件的管理是基于 helm chart 的。目录中有 frontend 和 backend 两个 subchart。我们暂且不做具体配置，先进行具体业务代码的开发。
