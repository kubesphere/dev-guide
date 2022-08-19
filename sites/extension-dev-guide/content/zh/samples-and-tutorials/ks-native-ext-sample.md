---
title: 开发扩展组件
weight: 901
description: 一个从零开始包含完整的前后端的 KubeSphere 扩展组件开发过程示例
---

在[入门指南](/extension-dev-guide/zh/get-started/)的章节中我们已经准备好了开发环境并且创建了一个简单的 [Hello World](/extension-dev-guide/zh/get-started/hello-world-extension/) 扩展组件项目。

本章将以开发一个员工管理功能扩展组件为例，带大家熟悉扩展组件的开发、测试流程

## 需求与设计

在需求设计阶段，我们需要完成功能需求分析，UI 设计。

假设我们要在 KubeSphere 前段页面中增加员工管理模块，菜单入口在页面的顶部栏。在这个模块里我们可以查看、新增、修改、删除员工信息。设计图如下：

1. 员工管理列表页
   ![](images/pluggable-arch/employee-sample-list.png)

2. 新增员工
   ![](images/pluggable-arch/employee-sample-form.png)

3. 员工详情页
   ![](images/pluggable-arch/employee-sample-detail.png)

## 后端开发

紧接着，我们需要设计前后端交互所涉及的 API 并提供具体的功能实现，后端开发不限制技术栈，开发者可以自由的选择自己擅长的语言和框架进行开发。在本示例中我们采用 `go`、`gin`、`gorm`、`sqlite` 提供了具体的功能实现，源代码请参考 [GitHub - employee: A demo app build with go gin, gorm and sqlite](https://github.com/kubesphere/extension-samples/tree/master/employee-backend)。

{{% notice note %}}
借助 [KubeSphere API 扩展机制](zh/architecture/backend-extension-architecture/)，可以灵活的将您的 API 接入 KubeSphere API 网关，以提供统一的认证、鉴权能力，您还可以通过 ks-core 提供的 [API](zh/references/kubesphere-api/) 接入 KubeSphere 租户体系。
{{% /notice %}}

#### 1. 构建镜像

当完成后端的 API 开发之后，需要将的后端组件通过容器进行构建，以下为开发环境中构建镜像的示例：

```shell
$ cd ~/workspace/kubesphere
$ git clone https://github.com/kubesphere/extension-samples.git
$ pushd extension-samples/extensions-backend/employee
$ docker build -t <YOUR_REPO>/employee-api:latest .
$ docker push <YOUR_REPO>/employee-api:latest
$ popd
```

#### 2. 部署后端服务

当后端容器镜像构建完成后，可以借助 (alias 或者 dev-tools 中提供的) kubectl 将 employee-api 部署到 KubeSphere 环境中。

```bash
$ kubectl create deployment employee-api --image=kubespheredev/employee-api # 可以使用我们已经事先构建好的镜像直接部署
$ kubectl expose deployment employee-api --type=ClusterIP --name=employee-api --port=8080
```

验证部署是否成功，pod 是否处于 Running 状态

```bash
$ kubectl get po
NAME                            READY   STATUS    RESTARTS   AGE
employee-api-6dc7df84d8-5sr7g   1/1     Running   0          6m41s
```

#### 3. 注册 API 到 ks-apiserver

通过创建 [APIService](zh/architecture/backend-extension-architecture/#apiservice) 资源对象，我们可以将 employee-api 提供的 API 注册到 ks-apiserver 中供前端组件统一集成。

以下的资源示例将向 ks-apiserver 注册路径为 `/kapis/employee.kubesphere.io/v1alpha1` 的 API

```bash
$ cat << EOF > v1alpha1.employee.kubesphere.io.yaml
apiVersion: extensions.kubesphere.io/v1alpha1
kind: APIService
metadata:
  name: v1alpha1.employee.kubesphere.io
spec:
  group: employee.kubesphere.io
  version: v1alpha1                                      
  nonResourceURLs: []
  url: http://employee-api.default.svc:8080
status:
  state: Enabled
EOF
$ kubectl apply -f v1alpha1.employee.kubesphere.io.yaml
```

验证 API 注册是否成功，正常情况下您可以通过 ks-apiserver 获取到由 employee-api 提供的 employees 数据。

```bash
docker run --rm kubespheredev/dev-tools:v0.0.1 curl -su admin:P@88w0rd  http://`docker inspect --format '{{ .NetworkSettings.IPAddress }}' kubesphere`:30881/kapis/employee.kubesphere.io/v1alpha1/employees 
{"items":[{"ID":0,"CreatedAt":"0001-01-01T00:00:00Z","UpdatedAt":"2022-05-12T01:27:14.475941+08:00","DeletedAt":null,"id":3,"name":"Jack","email":"jack@yunify.com","age":21},{"ID":0,"CreatedAt":"2022-05-12T01:22:01.276225+08:00","UpdatedAt":"2022-05-12T01:26:39.561368+08:00","DeletedAt":null,"id":4,"name":"Jerry","email":"jerry@yunify.com","age":24}],"totalItems":2}
```


到这里后端的开发与 API 的注册就已经完成了，紧接着我们来看看前端的开发与测试流程。


## 前端开发

在[创建 Hello World 扩展组件](/extension-dev-guide/zh/get-started/hello-world-extension/)的章节中，我们已经创建了一个简单的 hello world 扩展组件。
我们可以继续在这个前端项目脚手架目录(`~/workspace/kubesphere/my-ext/`)中创建我们的第二个扩展组建 employee

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

这样，扩展组件的前端目录就创建出来了。目录结构如下：

```bash
$ tree -I 'node_modules' -L 4
.
├── babel.config.js
├── configs
│   ├── config.yaml
│   ├── console.config.js
│   └── local_config.yaml
├── extensions
│   ├── entry.ts
│   └── empoyee
│       ├── Dockerfile
│       ├── README.md
│       ├── package.json
│       └── src
│           ├── App.jsx
│           ├── index.js
│           ├── locales
│           └── routes
├── package.json
├── tsconfig.base.json
├── tsconfig.json
└── yarn.lock
```

现在我们可以执行以下命令运行本地开发环境

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
<i> [webpack-dev-server] Content not from webpack is served from '~/workspace/kubesphere/my-ext/dist' directory
<i> [webpack-dev-server] 404s will fallback to '/index.html'
Successfully started server on http://localhost:8000 
```

开发环境启动后，我们就可以进行具体的业务代码开发了。开发方式与普通 react app 基本一致，具体实现过程我们同样不做赘述了，源码参见：[GitHub - employee-frontend](https://github.com/kubesphere/extension-samples/tree/master/my-ext/extensions/employee)

前端开发完成后，我们同样需要将前端代码编译、打包成 docker 镜像：

1. 编译前端代码，在前端项目根目录(`~/workspace/kubesphere/my-ext/`)执行：
```shell
$ yarn build:ext employee
```

2. 打包成镜像，在扩展组件目录(`~/workspace/kubesphere/my-ext/extensions/employee`)执行：
```shell
$ docker build --platform linux/amd64  -t <yourname>/employee-frontend .   # 打包成 docker 镜像
```

## 扩展组件编排与打包

当我们准备好前后端扩展组件的镜像，以及扩展资源声明后，就可以借助 ksbuilder、Helm 对我们的扩展组件进行编排、打包、测试了。


#### 1. 初始化扩展组件管理工程

使用 `ksbuilder` 创建一个扩展组件的管理工程，该工程可以帮助我们管理需要打包扩展组件，借助该工程可以构建一个可以对外发布的扩展组件仓库镜像。

通过 `ksbuilder init <directory>` 初始化工程目录

```shell
$ ksbuilder init extension-repo
```
执行完成后，可以看到如下信息，表示项目初始化成功：
```shell
$ ksbuilder init extension-repo
Directory: ~/workspace/kubesphere/extension-repo

The project has been created.
```

#### 2. 创建 employee 扩展组件编排目录

工程初始化成功后，我们进入到工程目录中，通过交互式命令创建出扩展组件的管理目录。

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

当看到上面提示信息时表示扩展组件的编排目录 `employee` 创建成功，这同样是一个 [Helm Chart](https://helm.sh/zh/docs/topics/charts/) 工程目录(我们借助 Helm Chart 对我们的扩展组件进行编排)，目录结构如下：

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

我们需要在 `values.yaml` 中指定默认的前后端镜像，在 `extensions.yaml` 中补充 APIService、JSBundle 等 API 扩展声明。

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


#### 3. 打包扩展组件

上述步骤已经完成了扩展组件的编排工作，我们可以借助 ks-builder 对我们的扩展组件进行打包。




## 测试扩展组件包

然后在扩展组件管理工程根目录(`~/workspace/kubesphere/extension-repo/`)执行下述命令，将扩展组件部署到 kubesphere 环境中。

```shell
$ ksbuilder update employee
```

命令执行成功后，我们在前端工程中执行下面命令。在本地以 production 模式启动 ks-console，测试扩展组件相关功能。

```shell
$ yarn build:prod
$ yarn start
```

至此，扩展组件在本地的开发调试就完成了。



