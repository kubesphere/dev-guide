---
title: "扩展组件开发流程"
weight: 04
description: 介绍 KubeSphere 扩展组件的开发流程
---

本章节介绍 KubeSphere 扩展组件开发的基本流程。

### 搭建开发环境

在开始 KubeSphere 扩展组件的开发之前，需要先部署好 KubeSphere 并安装相关的开发工具：

* **KubeSphere Core：** KubeSphere 的核心组件，需要通过 helm 部署在 K8s 集群之中，为扩展组件的开发提供了基础的运行环境。
* **开发工具：** KubeSphere 团队提供了 `create-ks-project` 和 `ksbuilder` 等工具为扩展组件的开发提供支持，可根据实际需求安装 `Node.js`、`Helm`、`kubectl` 等开发工具。

参考[搭建开发环境](../quickstart/prepare-development-environment/)章节安装 KubeSphere Core 和开发工具。

### 扩展组件开发

在完成开发环境的搭建之后，请确保 KubeSphere 的开发环境可以正常访问，并开放相应的端口，以便本地调试。

#### 项目初始化

在开始开发之前，您需要对扩展组件的开发项目进行初始化：

1. 首先您需要使用 `yarn create ks-project <NAME>` 初始化一个用于 KubeSphere 前端扩展组件开发的工程目录。
2. 再使用 `yarn create:ext` 初始化一个扩展组件。

执行上述命令之后，将初始化如下的目录结构：

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

#### 开发组件的核心逻辑

在扩展组件项目初始化完成之后，就可以着手编写扩展组件的核心逻辑，KubeSphere 提供了丰富的 API 支持，请参考[功能定制](../feature-customization)章节，选择灵活的方式对 KubeSphere 的功能进行扩展。

#### 本地调试

在扩展组件的开发过程中，可以[对本地开发环境进行配置](../quickstart/hello-world-extension/#配置-kubesphere-console)，使用 `yarn dev` 本地运行 KubeSphere Console 对扩展组件进行调试。

### 打包发布

在完成扩展组件的开发之后，可以借助 ksbuilder 对扩展组件进行编排、打包与发布。

#### 打包扩展组件

KubeSphere 使用 Helm 作为扩展组件的打包编排规范，请参考[Helm Docs](https://helm.sh/docs/)。在 Helm 的基础之上，KubeSphere 扩展组件进一步提供了丰富的元数据定义能力，请参考[打包扩展组件](../packaging-and-release/packaging)。

#### 测试扩展组件

借助 ksbuilder 可以将编排好的扩展组件提交到本地的扩展组件市场中，方便部署测试， 请参考[测试扩展组件](../packaging-and-release/testing)。

#### 发布扩展组件

扩展组件在完成测试之后就可以借助 ksbuilder 提交到 KubeSphere Marketplace，通过平台的审核之后，扩展组件便可以被 KubeSphere 的用户订阅、安装。

在您提交扩展组件到 KubeSphere Marketplace 之前请务必仔细阅读相关[协议准则和条款](https://kubesphere.cloud)。