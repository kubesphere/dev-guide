---
title: "Procedure"
weight: 3
description: Describes a structured process to develop KubeSphere extensions.
---

This topic describes a structured process for developing KubeSphere extensions. Developing KubeSphere extensions includes setting up a development environment, creating a project, customizing features, and packaging and releasing extensions.

#### Set up a development environment

The development environment for KubeSphere extensions includes KubeSphere Core and development tools.

* KubeSphere Core: the minimal core component for KubeSphere, which provides a runtime for extension development.

* Development tools: the tools that are used to create a project, install dependencies, provide a runtime environment for extensions, and package and release extensions. On your server, you need to install development tools such as create-ks-ext and ksbuilder, and third-party tools such as Node.js, Helm, and kubectl.

For information about how to install KubeSphere Core and development tools, see [Set up a development environment](../quickstart/prepare-development-environment/).

#### Create a project

To quickly get started with the extension mechanism of KubeSphere, see [Initialize a project](../quickstart/hello-world-extension).

Developing extensions for KubeSphere follows this structure:

```bash
   kubesphere-extensions
   ├── frontend
   │   └── extensions
   │       └── hello-world
   └── backend
```

* `kubesphere-extensions`: the directory for developing extensions. You can specify a custom value.

  * ` frontend`: the directory for developing frontend extensions, including frontend dependencies and extensions.

    * `extensions`: the directory for frontend extensions. You can store the frontend modules of multiple extensions in the `extensions` directory to share the resources.

       * `hello-world`: the frontend module for extensions. `hello-world` is an example, and you can specify a custom directory name.

* `backend`: the directory for developing backend extensions. We recommended that you store the source code of backend extensions in the `backend` directory for centralized management. 您也可以根据需要将扩展组件后端源代码保存在其他位置。

KubeSphere 扩展组件前端开发需要使用 [React](https://reactjs.org) 框架，后端不限制开发语言。

#### 定制功能

您可以对扩展组件的主题、菜单挂载位置、访问控制、页面路由、国际化等功能特性进行定制。此外，KubeSphere 提供了 API 扩展接口，您可以将自定义 API 注册到 KubeSphere API 服务中供扩展组件调用。

开发扩展组件前后端请参阅[示例与教程](../examples)

#### 打包发布

您需要将扩展组件的前后端源代码构建成容器镜像，打包扩展组件安装包，将扩展组件安装包上架到本地的扩展组件商店。您可以通过扩展组件商店安装到 KubeSphere 环境中，以测试扩展组件的功能是否符合预期。可以参考以下步骤：

1. 参考[示例与教程](../examples/employee-management-extension-example/#员工管理扩展组件示例)构建镜像部分，将扩展组件的前后端源代码构建成容器镜像
2. 参考[打包扩展组件](../packaging-and-release/packaging)，将扩展组件前后端部署声明和 APIService、JSBundle 等扩展声明打包成扩展组件安装包
3. 参考[测试扩展组件](../packaging-and-release/testing)将扩展组件上架到本地的扩展组件商店中，安装扩展组件并测试使用扩展组件功能
   