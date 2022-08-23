---
title: 开发扩展组件
weight: 901
description: 一个从零开始包含完整的前后端的 KubeSphere 扩展组件开发过程示例
---

在[入门指南](/extension-dev-guide/zh/get-started/)的章节中我们已经准备好了开发环境并且创建了一个简单的 [Hello World](/extension-dev-guide/zh/get-started/hello-world-extension/) 扩展组件项目。

本章将以开发一个员工管理功能扩展组件为例，带大家熟悉扩展组件的开发、测试流程

## 需求与设计

假设我们要在 KubeSphere 前端页面中增加员工管理模块，菜单入口在页面的顶部栏。在这个模块里我们可以查看、新增、修改、删除员工信息。设计图如下：

1. 员工管理列表页
   ![Employee Management](images/pluggable-arch/employee-sample-list.png)

2. 新增员工
   ![Addn New Employee](images/pluggable-arch/employee-sample-form.png)

3. 员工详情页
   ![Employee Details](images/pluggable-arch/employee-sample-detail.png)

## 后端扩展组件开发

紧接着，我们需要设计前后端交互所涉及的 API 并提供具体的功能实现，后端开发不限制技术栈，开发者可以自由的选择自己擅长的语言和框架进行开发。在本示例中我们采用 `go`、`gin`、`gorm`、`sqlite` 提供了具体的功能实现，源代码请参考 [GitHub - employee: A demo app build with go gin, gorm and sqlite](https://github.com/kubesphere/extension-samples/tree/master/employee-backend)。

{{% notice note %}}
借助 [KubeSphere API 扩展机制](zh/architecture/backend-extension-architecture/)，可以动态的将您的 API 注册到 ks-apiserver，扩展组件的前端将 ks-apiserver 作为统一的网关入口，以实现统一的 API 认证、访问权限控制，您还可以通过 ks-core 提供的 [API](zh/references/kubesphere-api/) 接入 KubeSphere 租户体系。
{{% /notice %}}

#### 1. 构建镜像

当完成后端的 API 开发之后，需要将组件后端部分通过容器进行构建，以下为开发环境中构建镜像的示例，您也可以直接使用官方提供的镜像 kubespheredev/employee-api:latest。

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
$ kubectl create deployment employee-api --image=kubespheredev/employee-api:latest # 可以使用官方已经构建好的镜像直接部署
$ kubectl expose deployment employee-api --type=ClusterIP --name=employee-api --port=8080
```

验证部署是否成功，pod 是否处于 Running 状态

```bash
$ kubectl get po
NAME                            READY   STATUS    RESTARTS   AGE
employee-api-6dc7df84d8-5sr7g   1/1     Running   0          6m41s
```

#### 3. 注册后端扩展组件 API 到 ks-apiserver

通过创建 [APIService](zh/architecture/backend-extension-architecture/#apiservice) 资源对象，我们可以将 employee-api 提供的 API 注册到 ks-apiserver 中供前端组件统一集成。

以下的资源示例将向 ks-apiserver 注册路径为 `/kapis/employee.kubesphere.io/v1alpha1` 的 API：

```bash
$ cat << EOF > employee-api.yaml
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
  state: Available
EOF
$ kubectl apply -f employee-api.yaml
```

验证 API 注册是否成功，正常情况下可以通过 ks-apiserver 获取到由 employee-api 提供的 employees 数据。注意如果您修改了 admin 用户的默认密码，则需要修改命令行中 password 参数。

```bash
$ curl -s -u admin:P@88w0rd http://localhost:30881/kapis/employee.kubesphere.io/v1alpha1/employees | jq 
{
  "items": [
    {
      "ID": 0,
      "CreatedAt": "0001-01-01T00:00:00Z",
      "UpdatedAt": "2022-05-12T01:27:14.475941+08:00",
      "DeletedAt": null,
      "id": 3,
      "name": "Jack",
      "email": "jack@yunify.com",
      "age": 21
    },
    {
      "ID": 0,
      "CreatedAt": "2022-05-12T01:22:01.276225+08:00",
      "UpdatedAt": "2022-05-12T01:26:39.561368+08:00",
      "DeletedAt": null,
      "id": 4,
      "name": "Jerry",
      "email": "jerry@yunify.com",
      "age": 24
    }
  ],
  "totalItems": 2
}
```


到这里后端的开发与 API 的注册就已经完成了，紧接着我们来看看前端的开发与测试流程。


## 前端扩展组件开发

#### 1. 创建项目脚手架

在[创建 Hello World 扩展组件](/extension-dev-guide/zh/get-started/hello-world-extension/)的章节中，我们已经创建了一个简单的 hello world 扩展组件。
我们可以继续在这个前端项目脚手架目录(`~/workspace/kubesphere/extensions-frontend/`)中创建我们的第二个前端扩展组件 employee。

```shell
cd ~/workspace/kubesphere/extensions-frontend/
yarn create:ext
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
<i> [webpack-dev-server] Content not from webpack is served from '~/workspace/kubesphere/extensions-frontend/dist' directory
<i> [webpack-dev-server] 404s will fallback to '/index.html'
Successfully started server on http://localhost:8000 
```

开发环境启动后，我们就可以在本地环境中进行业务代码开发。开发方式与普通 react app 基本一致，本示例前端部分源码参见：[GitHub - employee-frontend](https://github.com/kubesphere/extension-samples/tree/master/extensions-frontend/extensions/employee)

便于演示，我们可以将示例仓库中的代码直接复制过来

```
cp -r ~/workspace/kubesphere/extension-samples/extensions-frontend/extensions/employee/* ~/workspace/kubesphere/extensions-frontend/extensions/employee
```


#### 2. 构建镜像

前端开发完成后，我们同样需要将前端代码编译、打包成 docker 镜像，也可以直接使用官方提供的镜像 `kubespheredev/employee-frontend:latest`。

```shell
$ yarn build:ext employee # 编译前端代码
$ pushd extensions/employee/
$ docker build -t <YOUR_REPO>/employee-frontend:latest .
$ docker push <YOUR_REPO>/employee-frontend:latest
$ popd
```

#### 3. 部署前端服务

可以使用官方已经构建好的镜像直接部署

```bash
$ kubectl create deployment employee-frontend --image=kubespheredev/employee-frontend:latest 
$ kubectl expose deployment employee-frontend --type=ClusterIP --name=employee-frontend --port=80
```

验证部署是否成功，pod 是否处于 Running 状态

```bash
$ kubectl get po
NAME                            READY   STATUS    RESTARTS   AGE
employee-frontend-7dc7df84d8-5sr7g   1/1     Running   0          5m31s
```

#### 4. 注册前端扩展组件到 ks-apiserver

与开发模式从本地加载扩展组件不同，production 模式下 ks-console 将通过 API 动态发现扩展组件并进行加载。当前端服务部署完成后，通过创建 [JSBundle](zh/architecture/backend-extension-architecture/#jsbundle) 资源对象，可以将 employee-frontend 提供的前端扩展包注册到 ks-apiserver 中，ks-console 会动态的将这些前端扩展加载到内核中。

以下的资源示例将向 ks-apiserver 注册前端 employee 扩展组件包，ks-console 会自动加载这些前端扩展组件包。

```bash
$ cat << EOF > employee-frontend.yaml
apiVersion: extensions.kubesphere.io/v1alpha1
kind: JSBundle
metadata:
  name: v1alpha1.employee.kubesphere.io
spec:
  rawFrom:
    url: http://employee-frontend.default.svc/dist/employee-frontend/index.js
status:
  state: Available
  link: /dist/employee-frontend/index.js
EOF
$ kubectl apply -f employee-frontend.yaml
```

可以在本地以 production 模式启动 ks-console，访问 `http://localhost:8000`

```shell
$ yarn build:prod
$ yarn start
```

或者直接访问 kubesphere 容器的 30880 端口，测试 production 模式下扩展组件是否正确加载。

正常情况下您可以通过以下入口访问到本示例中扩展组件的页面。

![employee-entry](images/get-started/employee-entry.png)

![employee-management](images/get-started/employee-management.png)


## 扩展组件打包

当我们准备好前后端扩展组件的镜像，以及扩展资源声明后，就可以借助 ksbuilder、Helm 对我们的扩展组件进行打包与测试了。


#### 1. 初始化扩展组件管理工程

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

#### 2. 初始化 employee 扩展组件包目录

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

我们需要在 `values.yaml` 中指定默认的前后端镜像，在 `extensions.yaml` 中补充 [APIService](zh/samples-and-tutorials/ks-native-ext-sample/#3-注册后端扩展组件-api-到-ks-apiserver)、[JSBundle](zh/samples-and-tutorials/ks-native-ext-sample/#3-注册前端扩展组件到-ks-apiserver) 等扩展声明。

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

通过上述步骤我们已经完成了扩展组件包的创建，接下来借助 ks-builder 将扩展组件部署后测试。

## 扩展组件部署

在扩展组件管理工程根目录（`~/workspace/kubesphere/extension-repo/`）执行下述命令，将扩展组件部署到 KubeSphere 环境中。

```shell
ksbuilder update employee
```

命令执行成功后，我们可以直接访问 kubesphere 容器 30880 端口打开 ks-console 页面并登陆，查看对应的扩展组件页面、导航栏按钮是否正常加载。


