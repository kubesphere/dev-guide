---
title: 打包扩展组件
weight: 1
description: "在测试与发布之前首先您需要将扩展组件进行打包"
---


在[开发示例](../../examples/)的章节中我们完成了前后端扩展组件开发，前后端源代码构建成容器镜像，准备好了APIService、JSBundle 等扩展声明，接下来您可以参考本节内容借助 ksbuilder、Helm 打包您的扩展组件。

您可以参考以下内容将[员工扩展组件示例](../../examples/employee-management-extension-example)打包成扩展组件安装包

### 初始化 employee 扩展组件包目录

前后端扩展组件都开发完成后，我们需要使用 `ksbuilder` 的交互式命令创建出扩展组件包的目录，该目录可以帮助我们管理需要打包的前后端扩展组件。

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
├── permissions.yaml
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

`permissions.yaml` 是扩展组件非必须的文件，扩展组件安装默认授权层级为 `namespace` ，如果您的扩展组件安装需要创建集群级别资源，请您根据插件安装所需要权限修改`permissions.yaml`文件中的`rules`。


### 打包员工管理扩展组件包

在[员工管理扩展组件示例](../../examples/employee-management-extension-example)中， 我们将完成了扩展组件开发，接下来我们可以按照以下步骤编排扩展组件安装包
1. 在`charts/backend` 和 `charts/frontend/`修改员工管理扩展组件前后端服务部署资源声明
2. 按照[注册后端扩展组件](../../examples/employee-management-extension-example/#3-注册后端扩展组件-api-到-ks-apiserver)  修改 `charts/backend/templates/extensions.yaml` [APIService](../../architecture/backend-extension-architecture/#apiservice)声明
3. 按照[注册前端扩展组件](../../examples/employee-management-extension-example/#4-注册前端扩展组件到-ks-apiserver)  修改 `charts/frontend/templates/extensions.yaml` [JSBundle](../../architecture/backend-extension-architecture/#jsbundle)声明


您可以从 GitHub 上克隆员工管理扩展组件安装包，查看其组成部分
```bash
cd  ~/kubesphere-extensions
git clone https://github.com/kubesphere/extension-samples.git
cp -r ~/kubesphere-extensions/extension-samples/deploy/employee ~/kubesphere-extensions/employee
```

接下来您可以参考[测试扩展组件](./testing)将进行员工管理扩展组件上架到 KubeSphere 扩展组件商店中进行安装测试

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

在扩展组件应用商店安装 grafana 扩展组件， 验证安装后功能：访问http://localhost:30880/proxy/grafana/login




