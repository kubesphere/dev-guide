---
title: Develop an Extension for Employee Management
weight: 1
description: Describes how to develop frontend and backend extensions from scratch.
---

在[快速入门](../../quickstart/)的章节中，我们已经准备好了开发环境并且创建了一个简单的 [Hello World](../../quickstart/hello-world-extension/) 扩展组件项目。

本章将以开发一个员工管理功能扩展组件为例，带大家熟悉扩展组件的开发、测试流程。

## Requirements and design

Assume that you want to add a feature for employee management to the frontend of KubeSphere, and the module can be accessed by clicking `Platform` in the upper left corner of the top navigation pane. In this module, you can view, add, modify, and delete employee information. The following figures show the design of this module:

1. Menu for employee management![Employee Management Menuemployee-management-menu](./sample-employee-menu.png)

2. Employee management page![Employee Management](./sample-employee-list.png)

3. Dialog box for adding an employee![Addn New Employee](./sample-employee-new.png)

4. Details page of an employee![Employee Details](./sample-employee-details.png)

## Develop backend extensions

紧接着，我们需要设计前后端交互所涉及的 API 并提供具体的功能实现，后端开发不限制技术栈，开发者可以自由地选择自己擅长的语言和框架进行开发。In this example, we use `go`, `gin`, `gorm`, and `sqlite` to implement features. For more information about the source code, see [Extension samples](https://github.com/kubesphere/extension-samples/tree/master/extensions-backend/employee).

{{% notice note %}}
借助 [KubeSphere API 扩展机制](../../architecture/backend-extension-architecture/)，可以动态地将您的 API 注册到 ks-apiserver。扩展组件的前端将 ks-apiserver 作为统一的网关入口，以实现统一的 API 认证、访问权限控制，您还可以通过 ks-core 提供的 [API](../../references/kubesphere-api/) 接入 KubeSphere 租户体系。
{{% /notice %}}

#### 1. Build an image

当完成后端的 API 开发之后，需要将组件后端部分通过容器进行构建。以下为开发环境中构建镜像的示例，您也可以直接使用官方提供的镜像 kubespheredev/employee-api:latest。

```shell
$ cd  ~/kubesphere-extensions
$ git clone https://github.com/kubesphere/extension-samples.git
$ pushd extension-samples/extensions-backend/employee
$ docker build -t <YOUR_REPO>/employee-api:latest .
$ docker push <YOUR_REPO>/employee-api:latest
$ popd
```

#### 2. Deploy a backend service

After the image is built, employee-api can be deployed to KubeSphere by kubectl (provided in alias or dev-tools).

```bash
$ kubectl create deployment employee-api --image=kubespheredev/employee-api:latest # 可以使用官方已经构建好的镜像直接部署
$ kubectl expose deployment employee-api --type=ClusterIP --name=employee-api --port=8080
```

验证部署是否成功，pod 是否处于 Running 状态。

```bash
$ kubectl get po
NAME                            READY   STATUS    RESTARTS   AGE
employee-api-6dc7df84d8-5sr7g   1/1     Running   0          6m41s
```

#### 3. Register the API of the backend extension to ks-apiserver

By creating an [APIService](../../architecture/backend-extension-architecture/#apiservice) object, you can register the API provided by employee-api to ks-apiserver for frontend integration.

The following sample command is used to register the API to ks-apiserver with the path `/kapis/employee.kubesphere.io/v1alpha1`:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubesphere/extension-samples/master/extensions-backend/employee/employee-apiservice.yaml
```

Verify that API registration is successful. In normal circumstances, the employees data provided by employee-api can be obtained through ks-apiserver. 注意如果您修改了 admin 用户的默认密码，则需要修改命令行中的 password 参数。

```bash
$ curl -s -u admin:P@88w0rd http://localhost:30881/kapis/employee.kubesphere.io/v1alpha1/employees 
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

Then, let's take a look at the development and testing process of frontend extensions.

## Develop frontend extensions

#### 1. Scaffold a project

In [Create a Hello World extension](../../quickstart/hello-world-extension/), you have created a simple extension. 我们可以继续在这个前端项目脚手架目录（`~/kubesphere-extensions/ks-console/`）中创建我们的第二个前端扩展组件 employee。

```shell
$ cd ~/kubesphere-extensions/ks-console/
$ yarn create:ext
```

Go to the command line interface and follow the prompts to create the `employee` extension.

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

In this way, the frontend directory of the extension is created. The directory structure is as follows:

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

现在我们可以执行以下命令运行本地开发环境。

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
<i> [webpack-dev-server] Content not from webpack is served from '~/kubesphere-extensions/ks-console/dist' directory
<i> [webpack-dev-server] 404s will fallback to '/index.html'
Successfully started server on http://localhost:8000 
```

After the development environment is started, you can develop business code in the local environment. 开发方式与普通 react app 基本一致，本示例前端部分源码参见：[GitHub - employee-frontend](https://github.com/kubesphere/extension-samples/tree/master/extensions-frontend/extensions/employee)。

便于演示，我们可以将示例仓库中的代码直接复制过来。

```shell
cp -r ~/kubesphere-extensions/extension-samples/extensions-frontend/extensions/employee/* ~/kubesphere-extensions/ks-console/extensions/employee
```

#### 2. Build an image

After the frontend development is complete, you also need to compile and package the frontend code into a docker image, or directly use the official image `kubespheredev/employee-frontend:latest`.

```shell
$ yarn build:ext employee # Compile the frontend code
$ pushd extensions/employee/
$ docker build -t <YOUR_REPO>/employee-frontend:latest .
$ docker push <YOUR_REPO>/employee-frontend:latest
$ popd
```

#### 3. Deploy a frontend service

可以使用官方已经构建好的镜像直接部署。

```bash
$ kubectl create deployment employee-frontend --image=kubespheredev/employee-frontend:latest 
$ kubectl expose deployment employee-frontend --type=ClusterIP --name=employee-frontend --port=80
```

验证部署是否成功，pod 是否处于 Running 状态。

```bash
$ kubectl get po
NAME                            READY   STATUS    RESTARTS   AGE
employee-frontend-7dc7df84d8-5sr7g   1/1     Running   0          5m31s
```

#### 4. Register the API of the frontend extension to ks-apiserver

In production mode, ks-console will dynamically discover and load the extension through the API, which is different from locally loading extensions in development mode. 当前端服务部署完成后，通过创建 [JSBundle](../../architecture/backend-extension-architecture/#jsbundle) 资源对象，可以将 employee-frontend 提供的前端扩展包注册到 ks-apiserver 中，ks-console 会动态地将这些前端扩展加载到内核中。

The following sample command registers the frontend employee extension package with ks-apiserver, and ks-console will automatically load the frontend extension package:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubesphere/extension-samples/master/extensions-frontend/extensions/employee/employee-jsbundle.yaml
```

You can start ks-console locally in production mode and visit `http://localhost:8000`. Alternatively, you can directly access port 30880 on the container to test whether the extension is loaded properly in production mode.

```shell
$ yarn build:prod
$ yarn start
```

接下来您可以参阅[打包扩展组件](../../packaging-and-release/packaging)，将本示例编译打包扩展组件安装包。