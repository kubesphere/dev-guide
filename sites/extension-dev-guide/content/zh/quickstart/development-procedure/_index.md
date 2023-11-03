---
title: "扩展组件开发流程"
weight: 04
description: 介绍 KubeSphere 扩展组件的开发流程
---

本章节介绍 KubeSphere 扩展组件的开发流程。

### 配置开发环境

在开发 KubeSphere 扩展组件之前，请确保已部署 KubeSphere 并安装了必要的开发工具：

- **KubeSphere Core**： KubeSphere 的核心组件，需要通过 helm 部署在 K8s 集群之中，它为扩展组件的开发提供了基础的运行环境。

- **开发工具**： KubeSphere 已提供了开发扩展组件所需要的工具，包括 `create-ks-project` 和 `ksbuilder`。此外，还可根据实际需求安装 `Node.js`、`Helm`、`kubectl` 等开发工具。

有关配置开发环境的更多信息，请参阅[搭建开发环境](../prepare-development-environment/)。

### 开发扩展组件

完成开发环境的配置后，请确保 KubeSphere 的开发环境可以正常访问，并已开放必要的端口，以便进行本地调试。

#### 初始化项目

在开发之前，需要对扩展组件的开发项目进行初始化，步骤如下：

1. 使用 `yarn create ks-project <NAME>` 初始化扩展组件的前端开发工程目录。

2. 使用 `yarn create:ext` 初始化扩展组件。

执行上述命令后，目录结构将如下所示：

```bash
kubesphere-extensions          
└── ks-console                   # 扩展组件前端开发工程目录
    ├── babel.config.js
    ├── configs
    │   ├── config.yaml
    │   └── local_config.yaml    # KubeSphere Console 的配置文件
    ├── extensions               # 扩展组件源代码目录
    │   ├── entry.ts
    │   └── hello-world          # Hello World 扩展组件的源代码目录
    │       ├── package.json
    │       └── src
    │           ├── App.jsx      # 扩展组件核心逻辑
    │           ├── index.js     # 扩展组件入口文件
    │           ├── locales      # 扩展组件国际化
    │           └── routes       # 扩展组件路由配置
    ├── package.json
    ├── tsconfig.base.json
    ├── tsconfig.json
    └── yarn.lock
```

#### 开发组件

项目初始化完成后，即可开始编写扩展组件的核心逻辑。 KubeSphere 提供了丰富的 API 支持，请参考[扩展能力](../../feature-customization)章节，对 KubeSphere 的功能进行扩展。

#### 本地调试

在扩展组件的开发过程中，[配置本地开发环境](../hello-world-extension/#配置-kubesphere-console)，然后使用 `yarn dev` 命令在本地运行 KubeSphere Console 来调试扩展组件。

### 打包发布

扩展组件开发完成后，借助 ksbuilder 工具来编排、打包和发布扩展组件。

#### 打包扩展组件

KubeSphere 使用 Helm 作为扩展组件的打包和编排规范，若要了解更多信息，请参阅 [Helm Docs](https://helm.sh/docs/)。在 Helm 的基础之上，KubeSphere 扩展组件提供了更丰富的元数据定义能力，详见[打包扩展组件](../../packaging-and-release/packaging)。

#### 测试扩展组件

借助 ksbuilder 工具即可将编排好的扩展组件提交到本地的扩展组件市场，以便进行测试和部署。详细信息请参考[测试扩展组件](../../packaging-and-release/testing)。

#### 发布扩展组件

一旦您的扩展组件经过测试，就可以使用 ksbuilder 工具将其提交到扩展市场 （KubeSphere Marketplace）。通过审核后，KubeSphere 用户就能订阅和安装您的扩展组件。

在将扩展组件提交到 KubeSphere Marketplace 之前，请务必详细阅读相关的协议、准则和条款。
