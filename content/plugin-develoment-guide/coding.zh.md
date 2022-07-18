---
title: 编码开发
weight: 402
description: 开发插件的前后端代码
---

在上个章节中我们创建了插件的管理工程，本章节我们以一个典型的包含前后端的 crud 插件的例子开始讲解具体的开发过程。

## 需求、设计
假设我们想在 ks 里增加一个员工管理模块。在这个模块里我们可以查看、新增、修改、删除员工信息。设计图如下：

1. 员工管理列表页
   ![](/images/plugin-arch/794091EB-6190-4FF7-9533-3FE81EC4877A.png)

2. 新增员工
   ![](/images/plugin-arch/6667BBCE-0400-4562-BCB1-EC12A2D0BEB7.png)

3. 员工详情页
   ![](/images/plugin-arch/995810AD-639C-4F33-8B8E-9D347225DAB9.png)

## 后端开发

后端开发不限制技术栈，开发者可以自由的选择自己擅长的语言进行开发。在这个示例中我们采用 `go`  `gin`   `gorm`  `sqlite`  的技术栈来开发。由需求看出我们需要实现针对 employee 的增删改查接口，接口的定义如下：

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

具体的业务代码实现过程我们不做赘述，源码参见：[GitHub - chenz24/employee: A demo app build with go gin, gorm and sqlite](https://github.com/chenz24/employee)

开发完成后我们需要 build 代码并将其打包成 docker 镜像
```
GOOS=linux GOARCH=amd64 go build main.go

docker build --platform linux/amd64 -t poppub123/employee-api .

docker push poppub123/employee-api:latest
```

执行完成以上命令后，我们需要将后端代码进行部署，以给前端开发提供接口调试。我们回到上个章节中讲到的插件的管理工程目录中。编辑 `values.yaml`

![](https://qui-site.pek3a.qingstor.com/059BC227-2692-4C9C-830D-1242057DA126.png)

如图，因为前端尚未有镜像，我们先将前端 disable。后端填好镜像名称及 tag。 回到插件管理工程根目录执行：

`ks-builder install employee `

这样后端就部署到了 k8s 集群中并且注册到 ks 的插件体系里了。可以通过 curl 测试接口是否已经被 ks-apiserver 接管。

## 前端开发

> 前置条件：已安装 nodejs yarn

1. 安装开发脚手架
```
yarn create ks-app my-app  # 在 my-app 目录下创建一个新的 ks-app
```

安装完成后，切换到脚手架目录。在 configs 目录下配置 local_config.yaml  ，填写正确的 ks apiserver 地址

![](https://qui-site.pek3a.qingstor.com/B7AF514B-2236-4E4C-BBAA-4C5FAA298105.png)

2. 新建插件目录
```
yarn create-plugin // 按照提示填写信息
```

命令执行成功后，我们在 plugins 目录可以看到插件的框架代码已经生成。目录结构如图：

![](/images/plugin-arch/plugin-directory.png)

如目录所示，前端的开发与普通的 react app 开发基本无异。执行下面命令开启前端开发环境

```
yarn dev 
```

具体的业务代码实现过程我们同样不做赘述，源码参见：[GitHub - chenz24/my-app](https://github.com/chenz24/my-app)

前端开发完成后，我们同样要将前端代码打包成 docker 镜像。

```
yarn build:plugin employee                                              # 编译打包前端项目

cd /path/to                                                             # 进入插件目录

docker build --platform linux/amd64  -t poppub123/employee-frontend .   # 打包成 docker 镜像
```

将镜像 push 到镜像仓库后，我们再回到插件管理工程的目录中，编辑 `values.yaml`，配置前端镜像

![](https://qui-site.pek3a.qingstor.com/48BAF7B0-C554-4910-938D-6276BB146DA2.png)

然后执行如下命令，将前端部署到集群中。

```
ks-builder upgrade employee
```

命令执行成功后，我们在前端工程中执行下面命令。在本地以 production 模式启动前端，查看插件是否安装成功。

```
yarn start
```

这样，插件在本地的开发调试就完成了。
