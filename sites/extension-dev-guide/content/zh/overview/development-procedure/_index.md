---
title: "扩展组件开发流程"
weight: 04
description: 介绍 KubeSphere 扩展组件的开发流程
---

本章节介绍 KubeSphere 扩展组件的开发流程。

### 配置开发环境

在开发 KubeSphere 扩展组件之前，需要创建 K8s 集群并部署 KubeSphere Luban 为扩展组件提供基础的运行环境，安装必要的开发工具（Node.js、Yarn、 create-ks-project、Helm、kubectl、ksbuilder 等等）。有关配置开发环境的更多信息，请参阅[搭建开发环境](../prepare-development-environment/)。

### 开发扩展组件

完成开发环境的配置后，请确保 KubeSphere Console 可以正常访问，开放必要的端口（kube-apiserver 6443、ks-console 30880,ks-apiserver 30881 等端口），以便进行本地调试。

#### 创建扩展组件开发项目

如果你的扩展组件需要对 KubeSphere 的前端进行扩展，需要借助 `create-ks-project` 创建扩展组件的前端工程目录，步骤如下：

1. 使用 `yarn create ks-project <NAME>` 初始化扩展组件的前端开发工程目录，借助此前端工程可本地运行 KubeSphere Console 并加载开发中的扩展组件。
2. 使用 `yarn create:ext` 初始化扩展组件前端的源代码目录。

目录结构：

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

如果你的扩展组件不包含前端扩展，可以跳过这一步骤。

#### 开发组件

完成扩展组件源代码目录的创建之后，即可开始编写扩展组件的核心逻辑。KubeSphere 提供了丰富的 API、和组件库，请参考[扩展能力](../../feature-customization)章节。

#### 本地调试

在扩展组件的开发过程中，[配置本地运行环境](../hello-world-extension/#配置本地运行环境)之后，可使用 `yarn dev` 命令在本地运行 KubeSphere Console 来调试扩展组件。

### 打包发布

开发完成后，需要借助 Helm、ksbuilder 对扩展组件进行编排、打包和发布。

#### 打包扩展组件

KubeSphere 使用 Helm 作为扩展组件的编排规范，若要了解更多信息，请参阅 [Helm Docs](https://helm.sh/docs/)。在 Helm 的基础之上，KubeSphere 扩展组件提供了更丰富的元数据定义能力，详见[打包扩展组件](../../packaging-and-release/packaging)。

#### 测试扩展组件

借助 ksbuilder 工具可以将编排好的扩展组件推送到开发环境中，以便进行部署与测试。详细信息请参考[测试扩展组件](../../packaging-and-release/testing)。

#### 发布扩展组件

扩展组件经过测试后，可以使用 ksbuilder 工具将其提交到扩展市场 （KubeSphere Marketplace）。

在将扩展组件提交到扩展市场之前，请务必详细阅读相关的协议、准则和条款。
