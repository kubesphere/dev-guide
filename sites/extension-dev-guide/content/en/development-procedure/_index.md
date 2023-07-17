---
title: "Procedure"
weight: 3
description: Describes a structured process to develop KubeSphere extensions.
---

This topic describes a structured process for developing KubeSphere extensions. Developing KubeSphere extensions includes setting up a development environment, creating a project, customizing features, and packaging and releasing extensions.

#### Set up a development environment

The development environment for KubeSphere extensions includes KubeSphere Core and development tools.

* KubeSphere Core: the minimal core component for KubeSphere, which provides a runtime for extension development.

* Development tools: the tools that are used to create a project, install dependencies, provide a runtime environment for extensions, and package and release extensions. On your server, you need to install development tools such as create-ks-project and ksbuilder, and third-party tools such as Node.js, Helm, and kubectl.

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

* `backend`: the directory for developing backend extensions. We recommended that you store the source code of backend extensions in the `backend` directory for centralized management. You can also save the source code in other directories as needed.

To develop frontend extensions, use the [React](https://reactjs.org) framework. The development of backend extensions has no requirements for languages.

#### Customize features

You can configure custom settings,  such as the theme, mount point for menus, access control, routing, and internationalization. KubeSphere provides an API that can integrate with extensions. You can register custom APIs to the KubeSphere API to implement remote calls.

For more information about developing frontend and backend extensions, see [Examples](../examples).

#### Package and release extensions

You need to build the source code of frontend and backend extensions into container images, package installation packages, and upload the installation packages to the local Extension Marketplace. Then, you can install extensions in the Extension Marketplace and test whether they can work as expected. Take the following steps:

1. Build the source code of frontend and backend extensions into container images. For more information, see "Build an image" in [Examples](../examples/employee-management-extension-example/#Manage extensions).
2. Package the declarations of frontend and backend extensions into installation packages, including APIService and JSBundle. For more information, see [Package extensions](../packaging-and-release/packaging).
3. Release extensions in the local Extension Marketplace, and install and test the extension features. For more information, see [Test extensions](../packaging-and-release/testing).
