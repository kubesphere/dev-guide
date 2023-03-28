---
title: "开发流程"
weight: 3
description: 介绍 KubeSphere 扩展组件开发流程。
---

本章节介绍 KubeSphere 扩展组件开发的基本流程。KubeSphere 扩展组件开发包括搭建开发环境、创建开发项目、定制功能以及打包发布几个步骤。

#### 搭建开发环境

KubeSphere 扩展组件开发环境包括 KubeSphere Core 和开发工具两部分。

* KubeSphere Core：KubeSphere 最小化核心组件，为扩展组件开发提供基础的运行环境。

* 开发工具：开发工具用于创建扩展组件开发项目、安装依赖、为扩展组件提供运行环境以及对扩展组件进行打包发布。您需要在开发主机上安装 KubeSphere 团队提供的 create-ks-ext 和 ksbuilder 等开发工具，以及 Node.js、Helm、kubectl 等第三方工具。

您可以参考[搭建开发环境](../quickstart/prepare-development-environment/)章节安装 KubeSphere Core 和开发工具。

#### 创建开发项目

开发环境搭建完成后，您可以参阅[初始化扩展组件开发项目](../quickstart/hello-world-extension)快速体验 KubeSphere 扩展机制。

KubeSphere 扩展组件开发目录基本结构如下：

```bash
   kubesphere-extensions
   ├── frontend
   │   └── extensions
   │       └── hello-world
   └── backend
```

* `kubesphere-extensions`：扩展组件开发目录，您可以自定义开发目录的名称。

  * `frontend`：扩展组件前端开发目录，包含前端依赖和扩展组件前端模块。

    * `extensions`：扩展组件前端模块目录。您可以将多个扩展组件的前端模块保存在 `extensions` 目录下以共用依赖。

       * `hello-world`：扩展组件的前端模块，目录名称 `hello-world` 仅为示例，您可以自定义目录的名称。

* `backend`：扩展组件后端开发目录。为便于集中管理，建议您将扩展组件后端源代码保存在 `backend` 目录中。您也可以根据需要将扩展组件后端源代码保存在其他位置。

KubeSphere 扩展组件前端开发需要使用 [React](https://reactjs.org) 框架，后端不限制开发语言。

#### 定制功能

您可以对扩展组件的主题、菜单挂载位置、访问控制、页面路由、国际化等功能特性进行定制。此外，KubeSphere 提供了 API 扩展接口，您可以将自定义 API 注册到 KubeSphere API 服务中供扩展组件调用。

开发扩展组件前后端请参阅[示例与教程](../examples)

#### 打包发布

您需要将扩展组件的前后端源代码构建成容器镜像，打包扩展组件安装包，将扩展组件安装包上架到本地的扩展组件商店。您可以通过扩展组件商店安装到 KubeSphere 环境中，以测试扩展组件的功能是否符合预期。可以参考以下步骤：

1. 参考[示例与教程](../examples/employee-management-extension-example/#员工管理扩展组件示例)构建镜像部分，将扩展组件的前后端源代码构建成容器镜像
2. 参考[打包扩展组件](../packaging-and-release/packaging)，将扩展组件前后端部署声明和 APIService、JSBundle 等扩展声明打包成扩展组件安装包
3. 参考[测试扩展组件](../packaging-and-release/testing)将扩展组件上架到本地的扩展组件商店中，安装扩展组件并测试使用扩展组件功能
   