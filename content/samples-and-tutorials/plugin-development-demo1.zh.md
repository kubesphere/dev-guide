---
title: 从零开始开发 KubeSphere 插件
weight: 901
description: 一个包含完整的前后端开发过程的插件示例
---

在上个章节中我们创建了插件的管理工程，本章节我们以一个典型的包含前后端的 crud 插件的例子开始讲解具体的开发过程。

## 需求、设计
假设我们想在 ks 里增加一个员工管理模块。在这个模块里我们可以查看、新增、修改、删除员工信息。设计图如下：

1. 员工管理列表页
   ![](/images/pluggable-arch/794091EB-6190-4FF7-9533-3FE81EC4877A.png)

2. 新增员工
   ![](/images/pluggable-arch/6667BBCE-0400-4562-BCB1-EC12A2D0BEB7.png)

3. 员工详情页
   ![](/images/pluggable-arch/995810AD-639C-4F33-8B8E-9D347225DAB9.png)

## 创建插件管理目录

如前一章节所讲，我们首先执行以下命令把插件的管理目录创建出来，在 `/root/lab/plugin-repo/` 中执行：

```shell
$ ksbuilder create
Please input plugin name:  employee
Input: employee
Please input plugin description:  employee plugin
Input: employee plugin
Other: app
✔ Monitoring
Input: Monitoring
Please input plugin author:  wayne
Input: wayne
Please input Email:  wayne@kubesphere.io
Input: wayne@kubesphere.io
Directory: /root/lab/plugin-repo/employee
```

如上，按照命令行提示输入信息后生成了 employee 目录。我们暂且不做配置，先进行业务代码的开发。

## 后端开发

后端开发不限制技术栈，也没有任何目录或者配置的束缚，开发者可以自由的选择自己擅长的语言和框架进行开发。在这个示例中我们采用 `go`  `gin`   `gorm`  `sqlite`  的技术栈来开发。
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

>需要注意的是，应用的路由我们定义在了 `/kapis/employee.kubesphere.io/v1alpha1` 前缀下。这是因为这里的访问路径需要与
`/lab/plugin-repo/employee/charts/backend/templates/extensions.yaml` 里定义的 api group 和 version 一致。

具体的业务代码实现过程我们不做赘述，源码参见：[GitHub - chenz24/employee: A demo app build with go gin, gorm and sqlite](https://github.com/chenz24/employee)

开发完成后我们需要 build 代码并将其打包成 docker 镜像：
```shell
$ GOOS=linux GOARCH=amd64 go build main.go

$ docker build --platform linux/amd64 -t kubesphere/employee-api .

$ docker push kubesphere/employee-api:latest
```

执行完成以上命令后，我们需要将后端代码进行部署，以给前端开发提供接口调试。我们回到上面讲到的插件的管理工程目录中。编辑 `values.yaml`

```yaml
frontend:
  enabled: false
  image:
    repository:
    tag: latest

backend:
  enabled: true
  image:
    repository: kubesphere/employee-api
    tag: latest
```

如上，因为前端尚未有镜像，我们先将前端 disable。后端填好镜像名称及 tag。 回到插件管理工程根目录执行：

```shell
# 在 /root/lab/plugin-repo/ 中执行
ksbuilder install employee
```

这样插件的后端就部署到了 k8s 集群中并且注册到 ks 的插件体系里了。可以通过 curl 测试接口是否已经被 ks-apiserver 接管。

## 前端开发

### 前置准备

- 安装 Node.js [Active LTS Release](https://nodejs.org/en/about/releases/)
  方法:
   - 使用 `nvm` (推荐)
      - [安装 nvm](https://github.com/nvm-sh/nvm#install--update-script)
      - [使用 nvm 安装和切换 Node 版本](https://nodejs.org/en/download/package-manager/#nvm)
   - [安装包安装](https://nodejs.org/en/download/)
- `yarn` [安装教程](https://classic.yarnpkg.com/en/docs/install)

## 开始开发

1. 安装开发脚手架

在任意目录下执行下面命令(这里我们选择在`/root/lab/`下执行)：

```shell
yarn create ks-app my-app  # 在 my-app 目录下创建一个新的 ks-app
```
命令执行完成后，我们会在终端上看到如下输出：
```shell
Success! Created my-app at /Users/chenzhen/Workspace/lab/my-app
Inside that directory, you can run several commands:

  yarn create-plugin <plugin-name>
    Create a new plugin.

  yarn dev
    Starts the development server.

  yarn build:dll
    Builds the dll files.

  yarn build:prod
    Builds the app for production.

  yarn start
    Runs the built app in production mode.

We suggest that you begin by typing:

  cd my-app
  yarn create-plugin <plugin-name>

And

  yarn dev

✨  Done in 117.41s.
```
这样，前端脚手架就创建好了。下面我们切换到脚手架目录里的 configs 目录下，编辑 `local_config.yaml` 配置正确的 ks apiserver 地址
如图：
```shell
server:
  apiServer:
    url: https://api.kubesphere.io
    wsUrl: ws://api.kubesphere.io
```

2. 新建插件目录

在脚手架目录下执行：

```shell
yarn create-plugin
```
回车执行命令会进入交互式命令行界面。按照提示输入响应信息。
命令执行成功后，我们在 plugins 目录可以看到插件的框架代码已经生成。目录结构如图：

![](/images/pluggable-arch/plugin-directory.png)

如目录所示，前端的开发与普通的 react app 开发基本无异。执行下面命令开启前端开发环境

```
yarn dev 
```

具体的业务代码实现过程我们同样不做赘述，源码参见：[GitHub - chenz24/my-app](https://github.com/chenz24/my-app)

前端开发完成后，我们同样要将前端代码打包成 docker 镜像。

```
yarn build:plugin employee                                              # 编译打包前端项目

cd /path/to                                                             # 进入插件目录

docker build --platform linux/amd64  -t kubesphere/employee-frontend .   # 打包成 docker 镜像
```

将镜像 push 到镜像仓库后，我们再回到插件管理工程的目录中，编辑 `values.yaml`，配置前端镜像

```yaml
frontend:
  enabled: true
  image:
    repository: kubesphere/employee-frontend
    tag: latest

backend:
  enabled: true
  image:
    repository: kubesphere/employee-api
    tag: latest
```

然后执行如下命令，将前端部署到集群中。

```
ksbuilder upgrade employee
```

命令执行成功后，我们在前端工程中执行下面命令。在本地以 production 模式启动前端，查看插件是否安装成功。

```
yarn start
```

这样，插件在本地的开发调试就完成了。如上面所述我们可以看出，插件的开发还是大家熟悉的典型前后端分离的开发方式，通过脚手架、cli 我们尽量简化了插件的部署、发布流程。
使开发者可以专注在业务代码的实现上。
