---
title: 开发扩展组件
weight: 901
description: 一个从零开始包含完整的前后端的 KubeSphere 扩展组件开发过程示例
---

在[入门指南](/extension-dev-guide/zh/get-started/)的章节中我们已经准备好了开发环境并且创建了一个简单的 [Hello World](/extension-dev-guide/zh/get-started/hello-world-extension/) 扩展组件项目。
本章节我们演示一个更典型的、包含前后端、具备增删改查能力的例子介绍扩展组件的具体开发过程。

## 需求与设计
假设我们要在 KubeSphere Console 里增加一个员工管理模块，菜单入口在页面的顶部栏。在这个模块里我们可以查看、新增、修改、删除员工信息。设计图如下：

1. 员工管理列表页
   ![](images/pluggable-arch/794091EB-6190-4FF7-9533-3FE81EC4877A.png)

2. 新增员工
   ![](images/pluggable-arch/6667BBCE-0400-4562-BCB1-EC12A2D0BEB7.png)

3. 员工详情页
   ![](images/pluggable-arch/995810AD-639C-4F33-8B8E-9D347225DAB9.png)

## 创建扩展组件管理工程

在进行具体的前后端代码开发之前，我们先使用 `ksbuilder` 创建一个扩展组件的管理工程，这个工程可以帮助我们预发布、调试扩展组件。

1. 通过 `ksbuilder init <directory>` 初始化工程目录

```shell
$ ksbuilder init my-extensions
```
执行完成后，可以看到如下信息，表示项目初始化成功：
```shell
$ ksbuilder init my-extensions
Directory: /Users/somebody/lab/extension-repo

The project has been created.
```

2. 创建扩展组件的管理目录

工程初始化成功后，我们进入到工程目录中，通过交互式命令创建出扩展组件的管理目录
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
Directory: /Users/somebody/lab/extension-repo/employee

The extension charts has been created.
```

当看到上面提示信息时表示扩展组件的管理目录 `employee` 创建成功，目录结构如下：

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
可以看出这是包含 `frontend`，`backend` 两个 subchart 的一个 helm chart 目录。这里我们暂且不做配置，先进行前后端代码的开发。

## 后端开发

后端开发不限制技术栈，开发者可以自由的选择自己擅长的语言和框架进行开发。在这个示例中我们采用 `go`  `gin`   `gorm`  `sqlite`  的技术栈来开发。
由需求看出我们需要实现针对 employee 的增删改查接口，接口的定义如下：

```go
v1 := r.Group("/kapis/employee.kubesphere.io/v1alpha1")
{
	v1.GET("/employees", getEmployees)
	v1.GET("/employee/:id", getEmployee)
	v1.POST("/employee", createEmployee)
	v1.PUT("/employee/:id", updateEmployee)
	v1.DELETE("/employee/:id", deleteEmployee)
	v1.OPTIONS("/employee", optionsEmployee)
}

r.GET("/healthz", healthz)

r.Run()

```
需要特别注意的是，应用的路由我们定义在了 `/kapis/employee.kubesphere.io/v1alpha1` 前缀下。这是因为 api 的访问路径需要与我们前面创建的插件管理目录中的 `charts/backend/templates/extensions.yaml`
里定义的 `api group` 和 `version` 一致。

> 注：参考 [后端扩展机制--APIService](/extension-dev-guide/zh/architecture/backend-extension-architecture/#apiservice)

具体的业务代码实现过程我们不做赘述，源码参见：[GitHub - employee: A demo app build with go gin, gorm and sqlite](https://github.com/kubesphere/extension-samples/tree/master/employee-backend)

开发完成后我们需要编译代码并将其打包成 docker 镜像，在源码目录里执行（注意镜像名称可自定义）：
```shell
$ GOOS=linux GOARCH=amd64 go build main.go

$ docker build --platform linux/amd64 -t <yourname>/employee-api .

$ docker push <yourname>/employee-api:latest
```

执行完成以上命令后，我们需要将后端代码部署以给前端开发提供接口调试。我们回到前面创建的扩展组件的管理工程目录中。编辑 `employee` 根目录的 `values.yaml`

```yaml
frontend:
  enabled: false
  image:
    repository:
    tag: latest

backend:
  enabled: true
  image:
    repository: <yourname>/employee-api
    tag: latest
```

如上，因为前端尚未有镜像，我们先将前端 disable。后端填好镜像名称及 tag。 回到扩展组件管理工程根目录执行：

```shell
ksbuilder install employee
```

当看到如下信息返回，表示扩展组件的后端部署到了 k8s 集群中并且注册到 ks 的扩展组件体系里了。

```shell
$ ksbuilder install employee
install extension employee
NAME: employee
LAST DEPLOYED: Sat Aug 13 01:42:20 2022
NAMESPACE: extension-default
STATUS: deployed
REVISION: 1
```


## 前端开发

在[创建 Hello World 扩展组件](/extension-dev-guide/zh/get-started/hello-world-extension/)的章节中，我们已经创建了一个简单的 hello world 扩展组件。
我们可以继续在这个脚手架目录中执行
```shell
$ yarn create:ext
```
进入交互式命令行界面，按提示输入创建出 `employee` 扩展组件。

```
$ yarn create:ext
yarn run v1.22.10
$ ksc create:ext
? Extension Name employee
? Display Name Employee Management
? Description Employee Management!
? Author ks
? Language JavaScript
? Ensure to create extension: [employee] ? Yes
✨  Done in 35.99s.
```

这样，扩展组件的前端目录就创建出来了。我们可以执行以下命令运行本地开发环境

```
$ yarn dev
yarn run v1.22.10
$ concurrently -k --raw 'yarn dev:client' 'yarn dev:server'
$ ksc-server
$ ksc dev
Dashboard app running at port 8000

✔ Webpack-bar
  Compiled successfully in 8.67s

<i> [webpack-dev-server] Project is running at:
<i> [webpack-dev-server] Loopback: http://localhost:8001/
<i> [webpack-dev-server] On Your Network (IPv4): http://192.168.1.133:8001/
<i> [webpack-dev-server] On Your Network (IPv6): http://[fe80::1]:8001/
<i> [webpack-dev-server] Content not from webpack is served from '/Users/somebody/KubeSphereProjects/my-ext/dist' directory
<i> [webpack-dev-server] 404s will fallback to '/index.html'
Successfully started server on http://localhost:8000 
```

开发环境启动后，我们就可以进行具体的业务代码开发了。开发方式与普通 react app 基本一致，具体实现过程我们同样不做赘述了，源码参见：[GitHub - employee-frontend](https://github.com/kubesphere/extension-samples/tree/master/my-ext/extensions/employee)

前端开发完成后，我们同样需要将前端代码打包成 docker 镜像。

```shell
$ yarn build:ext employee                                                 # 编译打包前端项目

$ cd /path/to                                                             # 进入扩展组件目录

$ docker build --platform linux/amd64  -t <yourname>/employee-frontend .   # 打包成 docker 镜像
```

将镜像 push 到镜像仓库后，我们再回到扩展组件管理工程的目录中，编辑 `values.yaml`，配置前端镜像并将 `frontend.enabled` 设置为 `true`

```yaml
frontend:
  enabled: true
  image:
    repository: <yourname>/employee-frontend
    tag: latest

backend:
  enabled: true
  image:
    repository: <yourname>/employee-api
    tag: latest
```

然后在扩展组件管理工程根目录执行下面命令，将前端部署到集群中。

```shell
$ ksbuilder update employee
```

命令执行成功后，我们在前端工程中执行下面命令。在本地以 production 模式启动前端，查看扩展组件是否安装成功。

```shell
$ yarn build:prod
$ yarn start
```

这样，扩展组件在本地的开发调试就完成了。如上面所述我们可以看出，扩展组件的开发还是大家熟悉的典型前后端分离的开发方式，通过脚手架、cli 我们尽量简化了扩展组件的部署、发布流程。 使开发者可以专注在业务代码的实现上。
