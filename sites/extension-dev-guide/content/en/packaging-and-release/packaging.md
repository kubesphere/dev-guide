---
title: Package Extensions
weight: 1
description: "Describes how to package extensions before test and release."
---

In the [Development Example](../../examples/) section, we have introduced how to develop frontend and backend extensions, build images, and prepare APIService and JSBundle. In the following, we will show you how to package your extensions using ksbuilder and Helm.

For information about how to build installation packages, see [Develop an extension for employee management](../../examples/employee-management-extension-example).

### Create a directory for the employee management extension

After the frontend and backend extensions are developed, we need to use `ksbuilder` to create an extension package directory, which can help us manage the frontend and backend extensions that need to be packaged.

```text
$ cd kubesphere-extensions
$ ksbuilder create
Please input extension name: employee
✔ Others
Please input extension author: ks
Please input Email (optional): ks@kubesphere.io
Please input author's URL (optional): https://www.kubesphere.io
Directory: ~/workspace/kubesphere-extensions/employee

The extension charts has been created.
```

If you see the preceding information, it indicates that the directory `employee` of the extension package is successfully created, which is similar to [ Helm Chart](https://helm.sh/zh/docs/topics/charts/) project directory (we use Helm Chart to orchestrate our extensions). The directory structure is as follows:

```text
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
├── permissions.yaml
├── static
│   ├── favicon.svg
│   └── screenshots
│       └── screenshot.png
└── values.yaml
```

`extension.yaml` contains the metadata of the extension:

```yaml
apiVersion: v1
name: employee               # Extension name (required)
version: 0.1.0               # Extension version, which must comply with semantic versioning (required)
displayName:                 # Name used for the display of the extension (required), and the Language Code must be based on ISO 639-1
  en: Sample Extension
description:                 # Extension description (required)
  en: This is a sample extension, and this is its description
category: devops             # Extension category (required)
keywords:                    # Keywords that describe extention features (optional)
  - others
home: https://kubesphere.io  # URL of the project homepage (optional)
sources:                     # URL list of the source code of the project (optional)
  - https://github.com/kubesphere
kubeVersion: ">=1.19.0"      # Compatible Kubernetes versions (optional)
ksVersion: ">=3.0.0"         # Compatible KubeSphere versions (optional)
maintainers:                 # Maintainer of the extension (optional)
  - name: "ks"
    email: "ks@kubesphere.io"
    url: "https://www.kubesphere.io"
provider:                    # Provider of the extension (optional)
  en:
    name: "QingCloud"
    email: "ks@kubesphere.io"
    url: "https://www.qingcloud.com"
staticFileDirectory: static  # Directory for storing static files such as icons and README of the extension (required)
icon: ./static/favicon.svg   # Icon used for the display of the extension, which can be defined as a relative path to a local file (required)
screenshots:                 # Extension snapshots (optional)
  - ./static/screenshots/screenshot.png
dependencies:                # Helm Chart that the extension relies on, and the syntax must be compatible with that of the dependencies in Helm's Chart.yaml (optional)
  - name: frontend
    condition: frontend.enabled
  - name: backend
    condition: backend.enabled
# external dependencies example
#externalDependencies:       # Dependencies of the extension (optional)
#  - name: a
#    type: extension
#    version: ">= 2.6.0"
#    required: true
#  - name: b
#    type: extension
#    version: ">= 2.2.0"
#    required: true
```

`permissions.yaml` defines the resource authorization required for extension installation:

```yaml
kind: ClusterRole
rules:  # Edit this rule if your extension needs to create and change cluster resources.
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
rules:  # Edit this rule if your extension needs to create and change namespace resources.
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

Reference:

1. https://kubernetes.io/docs/reference/access-authn-authz/rbac/
2. https://helm.sh/docs/topics/rbac/


### Package the employee management extension

In [Develop an extension for employee management](../../examples/employee-management-extension-example), you have complete the development of the extension, and then you can package the extension based on the following steps:

1. In `charts/backend` and `charts/frontend`, modify the frontend and backend declaration of the extension.
2. Modify the [APIService](../../architecture/backend-extension-architecture/#apiservice) declaration in `charts/backend/templates/extensions.yaml` according to [Register a backend extension](../../examples/employee-management-extension-example/#3-register-the-api-of-the-backend-extension-to-ks-apiserver).
3. Modify the [JSBundle](../../architecture/backend-extension-architecture/#jsbundle) declaration in `charts/frontend/templates/extensions.yaml` according to [Register a frontent extension](../../examples/employee-management-extension-example/#4-register-the-api-of-the-frontend-extension-to-ks-apiserver).


You can clone the package of the extension - "employee management" from GitHub:

```bash
cd  ~/kubesphere-extensions
git clone https://github.com/kubesphere/extension-samples.git
cp -r ~/kubesphere-extensions/extension-samples/extensions/employee ~/kubesphere-extensions/employee
```

Then, you can release the extension to KubeSphere Marketplace to install and test. For more information, see [Test extensions](./testing).

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
1. grafana-frontend deployment: grafana-ext/charts/frontend/templates/deployment.yaml. For code logic, see [Integrate third-party systems](../../examples/third-party-component-integration-example#develop-frontend-extensions).
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

Install the Grafana extension in the KubeSphere Marketplace, and visit http://localhost:30880/proxy/grafana/login to verify it.