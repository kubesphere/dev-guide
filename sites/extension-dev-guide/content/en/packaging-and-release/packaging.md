---
title: Package extensions
weight: 1
description: "Describes how to package extensions before test and release."
---

在[开发示例](../../examples/)的章节中我们完成了前后端扩展组件开发，前后端源代码构建成容器镜像，准备好了 APIService、JSBundle 等扩展声明，接下来您可以参考本节内容借助 ksbuilder、Helm 打包您的扩展组件。

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

当看到上面提示信息时表示扩展组件包的目录 `employee` 创建成功，它类似于 [Helm Chart](https://helm.sh/zh/docs/topics/charts/) 工程目录（我们借助 Helm Chart 对我们的扩展组件进行编排），目录结构如下：

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
├── favicon.svg
├── permissions.yaml
└── values.yaml
```

`extension.yaml` contains the metadata of the extension:

```yaml
apiVersion: v1
name: employee               # 扩展组件的名称（必填项）
version: 0.1.0               # 扩展组件的版本，须符合语义化版本规范（必填项）
displayName:                 # 扩展组件展示时使用的名称（必填项），Language Code 基于 ISO 639-1
  zh: 示例扩展组件
  en: Sample Extension
description:                 # 扩展组件展示时使用的描述（必填项）
  zh: 这是一个示例扩展组件，这是它的描述
  en: This is a sample extension, and this is its description
keywords:                    # 关于扩展组件特性的一些关键字（可选项）
  - Others
home: https://kubesphere.io  # 项目 home 页面的 URL（可选项）
sources:                     # 项目源码的 URL 列表（可选项）
  - https://github.com/kubesphere
kubeVersion: ">=1.19.0"      # 扩展组件兼容的 Kubernetes 版本限制（可选项）
ksVersion: ">=3.0.0"         # 扩展组件兼容的 KubeSphere 版本限制（可选项）
vendor:                      # 扩展组件提供商（可选项）
  name: "ks"
  email: "ks@kubesphere.io"
  url: "https://www.kubesphere.io"
icon: ./favicon.svg          # 扩展组件展示时使用的图标，可以定义为本地的相对路径（必填项）
dependencies:                # 扩展组件依赖的 Helm Chart，语法与 Helm 的 Chart.yaml 中 dependencies 兼容（可选项）
  - name: frontend
    condition: frontend.enabled
  - name: backend
    condition: backend.enabled
# external dependencies example
#externalDependencies:       # 对其它扩展组件的依赖（可选项）
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
rules:  # 如果你的扩展组件需要创建、变更 Cluster 级别的资源，你需要编辑此授权规则
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
rules:  # 如果你的扩展组件需要创建、变更 Namespace 级别的资源，你需要编辑此授权规则
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
1. 在 `charts/backend` 和 `charts/frontend` 修改员工管理扩展组件前后端服务部署资源声明
2. 按照[注册后端扩展组件](../../examples/employee-management-extension-example/#3-注册后端扩展组件-api-到-ks-apiserver)修改 `charts/backend/templates/extensions.yaml` [APIService](../../architecture/backend-extension-architecture/#apiservice) 声明
3. 按照[注册前端扩展组件](../../examples/employee-management-extension-example/#4-注册前端扩展组件到-ks-apiserver)修改 `charts/frontend/templates/extensions.yaml` [JSBundle](../../architecture/backend-extension-architecture/#jsbundle) 声明


You can clone the employee management extension package from GitHub to view details:
```bash
cd  ~/kubesphere-extensions
git clone https://github.com/kubesphere/extension-samples.git
cp -r ~/kubesphere-extensions/extension-samples/deploy/employee ~/kubesphere-extensions/employee
```

接下来您可以参考[测试扩展组件](../testing)将进行员工管理扩展组件上架到 KubeSphere 扩展组件商店中进行安装测试。

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

在扩展组件应用商店安装 grafana 扩展组件， 验证安装后功能：访问 http://localhost:30880/proxy/grafana/login
