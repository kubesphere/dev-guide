---
title: Package extensions
weight: 1
description: "Describes how to package extensions before test and release."
---


In [Examples](../../examples/), we have completed the development of the frontend and backend extensions. The frontend and backend source code is built into container images. Declarations such as the API service and JSBundle are ready. This topic describes how to package extensions with ksbuilder and Helm.

For information about how to build installation packages, see [Develop an extension for employee management](../../examples/employee-management-extension-example).

### Create a directory for the employee management extension

After the frontend and backend extensions are developed, we need to use `ksbuilder` to create an extension package directory, which can help us manage the frontend and backend extensions that need to be packaged.

```shell
$ cd kubesphere-extensions
$ ksbuilder create
Please input extension name:  employee
Input: employee
Please input extension description: this is employee extension
Input: this is employee extension
Other: app
✔ Monitoring
Input: Monitoring
Please input extension author:  ks
Input: ks
Please input Email:  ks@kubesphere.io
Input: ks@kubesphere.io
Directory: ~/workspace/kubesphere-extensions/employee

The extension charts has been created.
```

If you see the preceding information, it indicates that the directory `employee` of the extension package is successfully created, which is similar to [ Helm Chart](https://helm.sh/zh/docs/topics/charts/) project directory (we use Helm Chart to organize our extensions). The directory structure is as follows:

```shell
.
├── README.md
├── README_zh.md
├── charts
│   ├── backend
│   │   ├── Chart.yaml
│   │   ├── templates
│   │   │   ├── NOTES.txt
│   │   │   ├── deployment.yaml
│   │   │   ├── extensions.yaml
│   │   │   ├── helps.tpl
│   │   │   ├── service.yaml
│   │   │   └── tests
│   │   │       └── test-connection.yaml
│   │   └── values.yaml
│   └── frontend
│       ├── Chart.yaml
│       ├── templates
│       │   ├── NOTES.txt
│       │   ├── deployment.yaml
│       │   ├── extensions.yaml
│       │   ├── helps.tpl
│       │   ├── service.yaml
│       │   └── tests
│       │       └── test-connection.yaml
│       └── values.yaml
├── extension.yaml
├── favicon.svg
├── permissions.yaml
└── values.yaml
```

`extension.yaml` contains the metadata of the extension:

```yaml
apiVersion: v1
name: employee # The name of the extension (required)
version: 0.1.0 # The extension version that conforms to the semantic version specification (required)
displayName:   # The name used when the extension is displayed (required). The language code must be based on ISO 639-1.
  zh: 示例扩展组件 
  en: Sample Extension
description:   # 扩展组件展示时使用的描述（必填项）
  zh: 这是一个示例扩展组件，这是它的描述
  en: This is a sample extension, and this is its description
keywords:      # Keywords about the extension (optional)
  - Performance
home: https://kubesphere.io  # The URL of the project's home page (optional)
sources:       # The list of URLs to source code (optional)
  - https://github.com/kubesphere
kubeVersion: ">=1.19.0" #  Compatible Kubernetes versions for the extension (optional)
ksVersion: ">=3.0.0"    #  Compatible KubeSphere versions for the extension
dependencies:           #  The Helm Chart that the extension depends on (optional)
  - name: frontend
    condition: frontend.enabled
  - name: backend
    condition: backend.enabled
icon: ./favicon.svg     # The icon used when the extension is displayed, which can be specified as a local relative path (required)
```

`permissions.yaml` defines the resource authorization required for extension installation:

```yaml
kind: ClusterRole  
rules:  # If your extension needs to create and change resources at the cluster level, you need to edit this authorization rule
  - verbs:
      - 'create'
      - 'patch'
      - 'update'
    apiGroups:
      - 'extensions.kubesphere.io'
    resources:
      - '*'

---
kind: Role
rules:  # If your extension needs to create and change resources at the namespace level, you need to edit this authorization rule
  - verbs:
      - '*'
    apiGroups:
      - ''
      - 'apps'
      - 'batch'
      - 'app.k8s.io'
      - 'autoscaling'
    resources:
      - '*'
  - verbs:
      - '*'
    apiGroups:
      - 'networking.k8s.io'
    resources:
      - 'ingresses'
      - 'networkpolicies'
```

Reference

1. https://kubernetes.io/docs/reference/access-authn-authz/rbac/
2. https://helm.sh/docs/topics/rbac/


### Package the employee management extension

In [Develop an extension for employee management](../../examples/employee-management-extension-example), you have complete the development of the extension, and then you can package the extension based on the following steps:
1. In `charts/backend` and `charts/frontend/`, modify the frontend and backend declaration of the extension.
2. Modify [APIService](../../architecture/backend-extension-architecture/#apiservice) based on the description in [Register a backend extension](../../examples/employee-management-extension-example/#3-注册后端扩展组件-api-到-ks-apiserver).
3. Modify [JSBundle](../../architecture/backend-extension-architecture/#jsbundle) based on the description in [Register a frontend extension](../../examples/employee-management-extension-example/#4-注册前端扩展组件到-ks-apiserver).


You can clone the employee management extension package from GitHub to view details:
```bash
cd  ~/kubesphere-extensions
git clone https://github.com/kubesphere/extension-samples.git
cp -r ~/kubesphere-extensions/extension-samples/deploy/employee ~/kubesphere-extensions/employee
```

Then, you can release the extension to KubeSphere Extension Center to install and test. For more information, see [Test extensions](./testing).

### Examples

We are familiar with the development of third-party tools and systems that can integrate into existing KubeSphere web console in [Integrate third-party systems](../../examples/third-party-component-integration-example). In this section, you can get to know how to compile it into an installation package.


After using ksbuilder create to create a directory for the grafana-ext extension package, you can clone the code from GitHub using Helm Chart for orchestration.

```bash
cd  ~/kubesphere-extensions
git clone https://github.com/kubesphere/extension-samples.git
cp -r ~/kubesphere-extensions/extension-samples/deploy/grafana-ext ~/kubesphere-extensions/grafana-ext
```

The Grafana extension consists of the following parts:
1. Deployment file: grafana-ext/charts/backend/templates/grafana.yaml
1. grafana-frontend deployment: grafana-ext/charts/frontend/templates/deployment.yaml. For code logic, see [Integrate third-party systems](../../examples/third-party-component-integration-example#前端扩展组件开发).
1. ReverseProxy: grafana-ext/charts/frontend/templates/extensions.yaml

```yaml
apiVersion: extensions.kubesphere.io/v1alpha1
kind: ReverseProxy
metadata:
  name: grafana
spec:
  directives:
    headerUp:
      - -Authorization
    stripPathPrefix: /proxy/grafana
  matcher:
    method: '*'
    path: /proxy/grafana/*
  upstream:
    url: http://grafana.monitoring.svc
status:
  state: Available
```

After the Grafana extension is compiled, release the extension:

```shell
cd  ~/kubesphere-extensions
ksbuilder publish grafana-ext
```

Test the features: http://localhost:30880/proxy/grafana/login




