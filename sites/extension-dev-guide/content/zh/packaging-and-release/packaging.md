---
title: 打包扩展组件
weight: 01
description: 如何打包 KubeSphere 扩展组件
---

本章节将以[员工管理扩展组件](../../examples/employee-management-extension-example/)作为示例，带大家熟悉扩展组件的打包方式，在上述章节中完成扩展组件前后端的开发，构建好了需要用到的容器镜像之后，我门需要借助 ksbuilder、Helm 对扩展组件进行打包。

### 初始化 employee 扩展组件包目录

首先，我们需要使用 `ksbuilder` 的交互式命令创建出扩展组件包的目录。

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

当看到上面提示信息时表示扩展组件包的目录 `employee` 创建成功，我们使用 [Helm](https://helm.sh/zh/docs/topics/charts/) 对扩展组件进行编排，目录结构如下：

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

### 编辑 extension.yaml

`extension.yaml` 文件中包含了扩展组件的元数据信息，您需要完善它：

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
category: devops             # 扩展组件的分类（必填项）
keywords:                    # 关于扩展组件特性的一些关键字（可选项）
  - others
home: https://kubesphere.io  # 项目 home 页面的 URL（可选项）
sources:                     # 项目源码的 URL 列表（可选项）
  - https://github.com/kubesphere
kubeVersion: ">=1.19.0"      # 扩展组件兼容的 Kubernetes 版本限制（可选项）
ksVersion: ">=3.0.0"         # 扩展组件兼容的 KubeSphere 版本限制（可选项）
maintainers:                 # 扩展组件维护者（可选项）
  - name: "ks"
    email: "ks@kubesphere.io"
    url: "https://www.kubesphere.io"
provider:                    # 扩展组件提供商（必填项）
  zh:
    name: "青云科技"
    email: "ks@kubesphere.io"
    url: "https://www.qingcloud.com"
  en:
    name: "QingCloud"
    email: "ks@kubesphere.io"
    url: "https://www.qingcloud.com"
staticFileDirectory: static  # 扩展组件静态文件存放目录，图标和 README 引用的静态文件等需存放到该目录（必填项）
icon: ./static/favicon.svg   # 扩展组件展示时使用的图标，可以定义为本地的相对路径（必填项）
screenshots:                 # 扩展组件截图（可选项）
  - ./static/screenshots/screenshot.png
dependencies:                # 扩展组件依赖的 Helm Chart，语法与 Helm 的 Chart.yaml 中 dependencies 兼容（可选项）
  - name: extension
    tags:
      - extension
  - name: apiserver
    tags:
      - agent
# 扩展组件的安装模式，它可以是 HostOnly 或 Multicluster。
# HostOnly 模式下，扩展组件只会被安装到 host 集群。
# Multicluster 模式下 tag 中带有 agent  的 subchart 可以选择集群进行部署。    
installationMode: HostOnly
# 对其它扩展组件的依赖（可选项）
# externalDependencies:       
#   - name: a
#     type: extension
#     version: ">= 2.6.0"
#     required: true
#   - name: b
#     type: extension
#     version: ">= 2.2.0"
#     required: true
```

### 根据 Helm 的规范对扩展组件进行编排

扩展组件将以 Helm Chart 的形式在 KubeSphere 管理的集群中进行部署，需要对扩展组件依赖的资源进行编排，并设置合理的安装模式。

1. 在 `charts/backend` 和 `charts/frontend` 修改员工管理扩展组件前后端服务部署资源声明
2. 按照[注册后端扩展组件](../../examples/employee-management-extension-example/#3-注册后端扩展组件-api-到-ks-apiserver)修改 `charts/backend/templates/extensions.yaml` [APIService](../../feature-customization/extending-ui/) 声明
3. 按照[注册前端扩展组件](../../examples/employee-management-extension-example/#4-注册前端扩展组件到-ks-apiserver)修改 `charts/frontend/templates/extensions.yaml` [JSBundle](../../feature-customization/extending-api/) 声明

### 编辑 permissions.yaml

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

您也可以直接从 GitHub 上克隆员工管理这个示例扩展组件的安装包。

```bash
cd  ~/kubesphere-extensions
git clone https://github.com/kubesphere/extension-samples.git
cp -r ~/kubesphere-extensions/extension-samples/extensions/employee ~/kubesphere-extensions/employee
```

使用 `ksbuilder package` 命令便可以将编排好的扩展组件进行打包为压缩文件，便于分发。

```bash
cd  ~/kubesphere-extensions/extensions
ksbuilder package employee
```

接下来您可以参考[测试扩展组件](../testing)，将员工管理扩展组件上架到 KubeSphere 扩展市场中进行安装测试。
