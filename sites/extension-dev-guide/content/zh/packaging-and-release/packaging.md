---
title: 打包扩展组件
weight: 01
description: "在测试与发布之前首先您需要将扩展组件进行打包"
---

在[开发示例](../../examples/)的章节中我们完成了前后端扩展组件开发，前后端源代码构建成容器镜像，准备好了 APIService、JSBundle 等扩展声明，接下来您可以参考本节内容借助 ksbuilder、Helm 打包您的扩展组件。

您可以参考以下内容将[员工扩展组件示例](../../examples/employee-management-extension-example)打包成扩展组件安装包

### 初始化 employee 扩展组件包目录

前后端扩展组件都开发完成后，我们需要使用 `ksbuilder` 的交互式命令创建出扩展组件包的目录，该目录可以帮助我们管理需要打包的前后端扩展组件。

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

`extension.yaml` 文件中包含了扩展组件的元数据：

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

`permissions.yaml` 定义了扩展组件安装时所需要的资源授权：

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

相关文档：

1. https://kubernetes.io/docs/reference/access-authn-authz/rbac/
2. https://helm.sh/docs/topics/rbac/


### 打包员工管理扩展组件包

在[员工管理扩展组件示例](../../examples/employee-management-extension-example)中， 我们将完成了扩展组件开发，接下来我们可以按照以下步骤编排扩展组件安装包
1. 在 `charts/backend` 和 `charts/frontend` 修改员工管理扩展组件前后端服务部署资源声明
2. 按照[注册后端扩展组件](../../examples/employee-management-extension-example/#3-注册后端扩展组件-api-到-ks-apiserver)修改 `charts/backend/templates/extensions.yaml` [APIService](../../architecture/backend-extension-architecture/#apiservice) 声明
3. 按照[注册前端扩展组件](../../examples/employee-management-extension-example/#4-注册前端扩展组件到-ks-apiserver)修改 `charts/frontend/templates/extensions.yaml` [JSBundle](../../architecture/backend-extension-architecture/#jsbundle) 声明


您可以从 GitHub 上克隆员工管理扩展组件安装包，查看其组成部分
```bash
cd  ~/kubesphere-extensions
git clone https://github.com/kubesphere/extension-samples.git
cp -r ~/kubesphere-extensions/extension-samples/deploy/employee ~/kubesphere-extensions/employee
```

接下来您可以参考[测试扩展组件](../testing)将进行员工管理扩展组件上架到 KubeSphere 扩展组件商店中进行安装测试。

### 第三方系统扩展组件打包示例

我们在[第三方系统集成示例](../../examples/third-party-component-integration-example)熟悉了集成已有 Web UI 的第三方工具与系统的开发，接下来可以参考以下内容将其打包成扩展组件安装包


使用 ksbuilder create 创建 grafana-ext 扩展组件包的目录后，借助 Helm Chart 进行编排，您可以从 GitHub 上克隆本示例的代码。

```bash
cd  ~/kubesphere-extensions
git clone https://github.com/kubesphere/extension-samples.git
cp -r ~/kubesphere-extensions/extension-samples/deploy/grafana-ext ~/kubesphere-extensions/grafana-ext
```

grafana 扩展组件主要由以下部分组成：
1. grafana 部署文件: grafana-ext/charts/backend/templates/grafana.yaml
1. grafana-frontend deployment: grafana-ext/charts/frontend/templates/deployment.yaml，代码逻辑参考[第三方系统集成示例](../../examples/third-party-component-integration-example#前端扩展组件开发)
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

grafana 扩展组件编排完成后，上架扩展组件

```shell
cd  ~/kubesphere-extensions
ksbuilder publish grafana-ext
```

在扩展组件应用商店安装 grafana 扩展组件， 验证安装后功能：访问 http://localhost:30880/proxy/grafana/login
