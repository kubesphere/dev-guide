---
title: "Development Procedure"
weight: 4
description: Describes the development process of KubeSphere extensions.
---

This topic describes the development process of KubeSphere extensions.

#### Set up a development environment

Before developing KubeSphere extensions, ensure that you have installed KubeSphere and the necessary development tools.

- **KubeSphere Core**: It is the core component of KubeSphere, and should be deployed in a K8s cluster by Helm, which provides the basic runtime environment for extension development.

- **Development Tools**: KubeSphere has provided the necessary tools for developing extensions, including `create-ks-project` and `ksbuilder`. Additionally, you can install other development tools such as `Node.js`, `Helm`, `kubectl` based on your specific requirements.

For more information about setting up the development environment, please refer to [Build a Development Environment](../quickstart/prepare-development-environment/).

### Develop extensions

After you have finished configuring the development environment, make sure that the environment is accessible and that necessary ports have been opened for local debugging.

#### Initialize the project

Before development, initialize the extension development project as follows:

1. Initialize the frontend development directory for the extension using `yarn create ks-project <NAME>`.

2. Use `yarn create:extensions` to initialize the extension.

After executing the above commands, the directory structure will be as the following:

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

#### Develop the extension

Once the project is initialized, you can start writing the code of the extension. KubeSphere provides rich API, please refer to [Custom Features](../../feature-customization) to extend the capabilities of KubeSphere.

#### Local debugging

During the development, [configure the KubeSphere console](../hello-world-extension/#configure-the-kubesphere-web-console), and then use the `yarn dev` command to run the KubeSphere web console locally to debug the extension.

### Packaging and release

Once the extension has been developed, use the ksbuilder tool to orchestrate, package, and publish the extension.

#### Package the extension

KubeSphere uses Helm as the packaging and orchestration specification for extensions, please refer to [Helm Docs](https://helm.sh/docs/) for more information. Based on Helm, KubeSphere extensions provide richer metadata definition capabilities, as described in [Packaging Extensions](../../packaging-and-release/packaging).

#### Test the extension

The ksbuilder tool allows you to submit your orchestrated extensions to the local KubeSphere Marketplace for testing and deployment. View [Testing Extensions](../../packaging-and-release/testing) for details.

#### Publish the extension

Once your extension has passed the test, submit it to the KubeSphere Marketplace using the ksbuilder tool. If approved, KubeSphere users will be able to subscribe and install your extensions.

Before submitting your extension to the KubeSphere Marketplace, please carefully read the relevant agreements, guidelines, and terms.
