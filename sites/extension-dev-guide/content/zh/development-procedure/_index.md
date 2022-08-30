---
title: "开发流程"
weight: 03
description: 介绍 KubeSphere 扩展组件开发流程。
---

本节介绍 KubeSphere 扩展组件开发的基本流程。KubeSphere 扩展组件开发包括搭建开发环境、创建开发项目、定制功能以及打包、测试和发布几个步骤。

#### 搭建开发环境

KubeSphere 扩展组件开发环境包括 KubeSphere Core 和开发工具两部分。

* KubeSphere Core：KubeSphere 的核心组件，为扩展组件提供 API 服务。KubeSphere 团队已将 KubeSphere Core 构建成容器镜像，您可以通过运行容器快速安装 KubeSphere Core。

* 开发工具：您需要在开发主机上安装 KubeSphere 团队提供的 create-ks-ext 和 ksbuilder 等开发工具，以及 Node.js、Helm、kubectl 等第三方工具。开发工具用于创建扩展组件开发项目、安装依赖、为扩展组件提供运行环境以及对扩展组件进行打包、测试和发布。为简化工具安装，KubeSphere 团队已将上述工具构建成容器镜像，您可以通过运行容器快速安装工具。同时，如果您的开发主机上已经安装部分第三方工具，您也可以在开发主机上以安装二进制文件的方式安装工具。

#### 创建开发项目

您需要使用开发工具初始化扩展组件开发目录。

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

您可以对扩展组件的主题、菜单栏、访问控制、页面路由、国际化等功能特性进行定制。此外，KubeSphere 提供了 API 扩展接口，您可以将自定义 API 注册到 KubeSphere API 服务中供扩展组件调用。

#### 打包、测试和发布

您需要将扩展组件的前后端源代码构建成容器镜像，并使用 KubeSphere 团队提供的打包工具 ksbuilder 将扩展组件打包成 Helm Chart。您还需要将 Helm Chart 安装到 KubeSphere 环境中，以测试扩展组件的功能是否符合预期。打包生成的 Helm Chart 可作为扩展组件的最终发布件，您也可以进一步将 Helm Chart 和 Helm 仓库打包到容器镜像中，将容器镜像作为最终发布件。
