---
title: 打包扩展组件
weight: 01
description: "在测试与发布之前首先您需要将扩展组件进行打包"
---

当我们准备好前后端扩展组件的镜像，以及扩展资源声明后，就可以借助 ksbuilder、Helm 对我们的扩展组件进行打包与测试了。

### 初始化 employee 扩展组件包目录

前后端扩展组件都开发完成后，我们需要使用 `ksbuilder` 的交互式命令创建出扩展组件包的目录，该目录可以帮助我们管理需要打包的前后端扩展组件。。

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

当看到上面提示信息时表示扩展组件包的目录 `employee` 创建成功，它类似于 [Helm Chart](https://helm.sh/zh/docs/topics/charts/) 工程目录(我们借助 Helm Chart 对我们的扩展组件进行编排)，目录结构如下：

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
└── values.yaml
```

在 `extension.yaml` 中编辑扩展组件的元数据：
```yaml
apiVersion: v1
name: employee
version: 0.1.0
displayName:
  zh: 示例扩展组件
  en: Sample Extension
description:
  zh: 这是一个示例扩展组件，这是它的描述
  en: This is a sample extension, and this is its description
keywords:
  - Performance
home: https://kubesphere.io
sources:
  - https://github.com/kubesphere
kubeVersion: ">=1.19.0"
ksVersion: ">=3.0.0"
dependencies:
  - name: frontend
    condition: frontend.enabled
  - name: backend
    condition: backend.enabled
icon: ./favicon.svg
```

`extension.yaml` 是扩展组件必须的文件，它包含以下字段：

1. `apiVersion`: 扩展组件的 API 版本（必填项，可选值：v1）
1. `name`: 扩展组件的名称（必填项）
1. `version`: 扩展组件的版本，须符合 语义化版本 规范（必填项）
1. `displayName`: 扩展组件展示时使用的名称，对于不同的语言环境，使用不同的多语言处理（必填项）
1. `description`: 扩展组件展示时使用的描述，对于不同的语言环境，使用不同的多语言处理（必填项）
1. `keywords`: 关于扩展组件特性的一些关键字（可选项）
1. `home`: 项目 home 页面的 URL（可选项）
1. `sources`: 项目源码的 URL 列表（可选项）
1. `kubeVersion`: 扩展组件兼容的 Kubernetes 语义化版本（可选项）
1. `ksVersion`: 扩展组件兼容的 KubeSphere 语义化版本（可选项）
1. `dependencies`: 扩展组件依赖的 Helm Chart，语法与 Helm 的 Chart.yaml 中 dependencies 兼容（可选项）
1. `icon`: 扩展组件展示时使用的图标，可以定义为本地的相对路径（必填项）

我们需要在 `values.yaml` 中指定默认的前后端镜像，在 `charts/backend/templates/extensions.yaml` 和 `charts/frontend/templates/extensions.yaml` 中补充 [APIService](../../examples/employee-management-extension-example/#3-注册后端扩展组件-api-到-ks-apiserver)、[JSBundle](../../examples/employee-management-extension-example/#3-注册前端扩展组件到-ks-apiserver) 等扩展声明。

```yaml
frontend:
  enabled: true
  image:
    repository:  <YOUR_REPO>/employee-frontend
    tag: latest

backend:
  enabled: true
  image:
    repository: <YOUR_REPO>/employee-api
    tag: latest
```


### 第三方系统扩展组件打包示例

使用 ksbuilder create 创建grafana-ext扩展组件包的目录后，借助Helm Chart 进行编排，您可以从 GitHub 上克隆本示例的代码。

```bash
cd  ~/kubesphere-extensions
git clone https://github.com/kubesphere/extension-samples.git
cp -r ~/kubesphere-extensions/extension-samples/deploy/grafana-ext ~/kubesphere-extensions/grafana-ext
```

grafana-ext扩展组件主要由以下部分组成：
1. grafana的部署文件: grafana-ext/charts/backend/templates/grafana.yaml
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

grafana-ext编排完成后，上架扩展组件

```shell
cd  ~/kubesphere-extensions
ksbuilder publish grafana-ext
```

打开 ks-console 页面，进行安装，或者使用subscription安装扩展组件

```yaml
apiVersion: kubesphere.io/v1alpha1
kind: Subscription
metadata:
  name: grafana-ext-q
spec:
  enabled: true
  extension:
    name: grafana-ext
    version: 0.1.0
```

当前KubeSphere LuBan 4.0 安装扩展组件前，需要给安装扩展组件默认的namespace extension-grafana-ext的default账号授权，后续会开放此部分配置功能，可以参考下述权限进行测试安装

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: grafana-ext
roleRef:
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: default
    namespace: extension-grafana-ext
```

安装完成后可以在ks-console 页面查看扩展组件安装状态，安装失败可以在默认的namespace extension-grafana-ext查看日志。

验证grafana插件安装后功能：访问http://localhost:30880/proxy/grafana/login

