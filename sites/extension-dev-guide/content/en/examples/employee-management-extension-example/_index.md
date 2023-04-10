---
title: Manage extensions
weight: 1
description: Describes how to develop frontend and backend extensions from scratch.
---

Before you get started, make sure a development environment is set up and a project named [Hello World](../../quickstart/hello-world-extension/) is created for developing extensions. For information about how to set up an environment and create a project, see [Quick start](../../quickstart/).

This topic describes how to develop and test extensions by developing an extension for employee management.

## Requirements and design

Assume that you want to add a feature for employee management to the frontend of KubeSphere, and the module can be accessed by clicking `Platform` in the upper left corner of the top navigation pane. In this module, you can view, add, modify, and delete employee information. The following figures show the design of this module:

1. Menu for employee management![Employee Management Menuemployee-management-menu](./sample-employee-menu.png)

2. Employee management page![Employee Management](./sample-employee-list.png)

3. Dialog box for adding an employee![Addn New Employee](./sample-employee-new.png)

4. Details page of an employee![Employee Details](./sample-employee-details.png)

## Develop backend extensions

Then, you need to design APIs related to frontend and backend interactions and provide specific functional implementations. Backend development is not subject to the technology stack, and developers can choose their own language and framework for development. In this example, we use `go`, `gin`, `gorm`, and `sqlite` to implement features. For more information about the source code, see [Extension samples](https://github.com/kubesphere/extension-samples/tree/master/extensions-backend/employee).

{{% notice note %}}
With the help of [Backend extensions](../../architecture/backend-extension-architecture/), you can dynamically register your API with ks-apiserver, and frontend extensions use ks-apiserver as a unified gateway to achieve unified API authentication and access control. You can also use the [API](../../references/kubesphere-api/) provided by ks-core to integrate with the KubeSphere tenant system.
{{% /notice %}}

#### 1. Build an image

After you complete the backend API development, the backend part of the extension needs to be containerized. The following is an example of building an image in the development environment. You can also use the official image kubespheredev/employee-api:latest.

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

Verify that the deployment was successful and the pod is in the Running state:

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

Verify that API registration is successful. In normal circumstances, the employees data provided by employee-api can be obtained through ks-apiserver. Note that if you change the default password of the admin user, you need to modify the password parameter in the command line.

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

In [Create a Hello World extension](../../quickstart/hello-world-extension/), you have created a simple extension. You can continue to create your second frontend extension named employee in the directory `~/kubesphere-extensions/frontend/`.

```shell
$ cd ~/kubesphere-extensions/frontend/
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

Execute the following command to run the local development environment:

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
<i> [webpack-dev-server] Content not from webpack is served from '~/kubesphere-extensions/frontend/dist' directory
<i> [webpack-dev-server] 404s will fallback to '/index.html'
Successfully started server on http://localhost:8000 
```

After the development environment is started, you can develop business code in the local environment. The development method is similar to that of a regular React application. For information about the source code, see [Extension samples](https://github.com/kubesphere/extension-samples/tree/master/extensions-frontend/extensions/employee).

For demonstration, you can directly copy the code from the sample repository.

```shell
cp -r ~/kubesphere-extensions/extension-samples/extensions-frontend/extensions/employee/* ~/kubesphere-extensions/frontend/extensions/employee
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

You can use an official image to deploy a service:

```bash
$ kubectl create deployment employee-frontend --image=kubespheredev/employee-frontend:latest 
$ kubectl expose deployment employee-frontend --type=ClusterIP --name=employee-frontend --port=80
```

Verify that the deployment was successful and the pod is in the Running state:

```bash
$ kubectl get po
NAME                            READY   STATUS    RESTARTS   AGE
employee-frontend-7dc7df84d8-5sr7g   1/1     Running   0          5m31s
```

#### 4. Register the API of the frontend extension to ks-apiserver

In production mode, ks-console will dynamically discover and load the extension through the API, which is different from locally loading extensions in development mode. After the frontend service is deployed, by creating a [JSBundle](../../architecture/backend-extension-architecture/#jsbundle) object, the package of the frontend extension provided by employee-frontend can be registered in ks-apiserver, and ks-console will dynamically load the frontend extension to the kernel.

The following sample command registers the frontend employee extension package with ks-apiserver, and ks-console will automatically load the frontend extension package:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubesphere/extension-samples/master/extensions-frontend/extensions/employee/employee-jsbundle.yaml
```

You can start ks-console locally in production mode and visit `http://localhost:8000`. Alternatively, you can directly access port 30880 on the container to test whether the extension is loaded properly in production mode.

```shell
$ yarn build:prod
$ yarn start
```

For information about how to compile the installation package of the extension, see [Package extensions](../../packaging-and-release/packaging).