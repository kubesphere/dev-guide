---
title: 打包扩展组件
weight: 01
description: "在测试与发布之前首先您需要将扩展组件进行打包"
---

当我们准备好前后端扩展组件的镜像，以及扩展资源声明后，就可以借助 ksbuilder、Helm 对我们的扩展组件进行打包与测试了。

### 初始化扩展组件管理工程

前后端扩展组件都开发完成后，我们需要使用 `ksbuilder` 创建一个扩展组件的管理工程，该工程可以帮助我们管理需要打包的前后端扩展组件。基于该工程我们还可以构建一个可以对外发布的扩展组件仓库镜像。

通过 `ksbuilder init <directory>` 初始化工程目录

```shell
ksbuilder init extension-repo
```
执行完成后，可以看到如下信息，表示项目初始化成功：
```shell
$ ksbuilder init extension-repo
Directory: ~/workspace/kubesphere/extension-repo

The project has been created.
```

### 初始化 employee 扩展组件包目录

工程初始化成功后，我们进入到工程目录中，通过交互式命令创建出扩展组件包的目录。

```shell
$ cd extension-repo
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
Directory: ~/workspace/kubesphere/extension-repo/employee

The extension charts has been created.
```

当看到上面提示信息时表示扩展组件包的目录 `employee` 创建成功，这同样是一个 [Helm Chart](https://helm.sh/zh/docs/topics/charts/) 工程目录(我们借助 Helm Chart 对我们的扩展组件进行编排)，目录结构如下：

```shell
.
├── Chart.yaml
├── charts
│     ├── backend
│     │     ├── Chart.yaml
│     │     ├── templates
│     │     │     ├── NOTES.txt
│     │     │     ├── deployment.yaml
│     │     │     ├── extensions.yaml
│     │     │     ├── helps.tpl
│     │     │     ├── service.yaml
│     │     │     └── tests
│     │     │         └── test-connection.yaml
│     │     └── values.yaml
│     └── frontend
│         ├── Chart.yaml
│         ├── templates
│         │     ├── NOTES.txt
│         │     ├── deployment.yaml
│         │     ├── extensions.yaml
│         │     ├── helps.tpl
│         │     ├── service.yaml
│         │     └── tests
│         │         └── test-connection.yaml
│         └── values.yaml
└── values.yaml
```

我们需要在 `values.yaml` 中指定默认的前后端镜像，在 `extensions.yaml` 中补充 [APIService](zh/examples/employee-management-extension-example/#3-注册后端扩展组件-api-到-ks-apiserver)、[JSBundle](zh/examples/employee-management-extension-example/#3-注册前端扩展组件到-ks-apiserver) 等扩展声明。

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



