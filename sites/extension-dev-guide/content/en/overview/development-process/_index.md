---
title: "Development Process"
weight: 4
description: Describes the development process of KubeSphere extensions.
---

This topic describes the development process of KubeSphere extensions.

### Set up a development environment

Before developing KubeSphere extensions, create a Kubernetes (K8s) cluster and deploy KubeSphere Luban to provide the basic runtime environment for the extensions. Additionally, you need to install essential development tools such as Node.js, Yarn, create-ks-project, Helm, kubectl, ksbuilder. For more information about setting up the development environment, please refer to [Build a Development Environment](../../quickstart/prepare-development-environment/).

### Develop extensions

After you have finished configuring the development environment, make sure that the KubeSphere Console is accessible and that necessary ports (kube-apiserver 6443, ks-console 30880, ks-apiserver 30881) have been opened for local debugging.

#### Create a project for extension development

If your extensions will extend KubeSphere's frontend UI, please use `create-ks-project` to create the frontend project directory for your extensions.

Before development, initialize the extension development project as follows:

1. Initialize the frontend project directory for the extension using `yarn create ks-project <NAME>`. With this frontend project, you can locally run the KubeSphere Console and load the developing extensions.

2. Use `yarn create:extensions` to initialize the source code directory for the frontend of the extension.

The directory structure will be as the following:

```bash
kubesphere-extensions          
└── ks-console                   # Extension frontend development directory
    ├── babel.config.js
    ├── configs
    │   ├── config.yaml
    │   └── local_config.yaml    # Configuration file of the KubeSphere web console
    ├── extensions               # Source code directory for the extension
    │   ├── entry.ts
    │   └── hello-world          # Source code directory for the Hello World extension
    │       ├── package.json
    │       └── src
    │           ├── App.jsx      # Extension core logic
    │           ├── index.js     # Extension entry file
    │           ├── locales      # Extension internationalization
    │           └── routes       # Extension route configuration
    ├── package.json
    ├── tsconfig.base.json
    ├── tsconfig.json
    └── yarn.lock
```
If your extension does not include frontend extensions, you can skip this step.

#### Develop the extension

After completing the creation of the extension's source code directory, you can begin writing the core logic for the extension. KubeSphere provides a rich set of APIs and component libraries; please refer to [Custom Features](../../feature-customization) for more information.

#### Local debugging

During the development, [configure the KubeSphere console](../../quickstart/hello-world-extension/#configure-the-kubesphere-web-console), and then use the `yarn dev` command to run the KubeSphere web console locally to debug the extension.

### Packaging and release

Once the extension has been developed, use Helm and ksbuilder to orchestrate, package, and publish the extension.

#### Package the extension

KubeSphere uses Helm as the orchestration specification for extensions, please refer to [Helm Docs](https://helm.sh/docs/) for more information. Based on Helm, KubeSphere extensions provide richer metadata definition capabilities, as described in [Packaging Extensions](../../packaging-and-release/packaging).

#### Test the extension

The ksbuilder tool allows you to submit your orchestrated extensions to the development environment for testing and deployment. View [Testing Extensions](../../packaging-and-release/testing) for details.

#### Publish the extension

Once your extension has passed the test, submit it to the KubeSphere Marketplace using the ksbuilder tool.

Before submitting your extension to the KubeSphere Marketplace, please carefully read the relevant agreements, guidelines, and terms.
