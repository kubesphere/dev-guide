---
title: 后端扩展机制
weight: 7200
description: KubeSphere 后端扩展机制介绍
---

KubeSphere 4.0 后端扩展机制主要包含 API 的动态代理、静态资源的代理、扩展组件的生命周期管理三个部分。保留了以下三个核心组件：

* `ks-apiserver` 是一个可拓展的 API 网关，为 KubeSphere 提供统一的 API 认证鉴权、请求的代理转发、API 的聚合能力。
* `ks-controller-manager` 实现了核心资源的控制逻辑。
* `ks-console` 为 KubeSphere 提供前端 Web 服务。

KubeSphere 构建在 Kubernetes 之上，借助 [Kubernetes 提供的扩展能力](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)实现了基本的数据存储、缓存同步等功能。

![backend-extension-arch](images/pluggable-arch/backend-arch.svg)

## 后端扩展机制原理

用户可以通过定义以下 CRD 向 KubeSphere 注册 API、前端扩展、动态资源代理，进而扩展 KubeSphere 的功能：

### APIService

KubeSphere 提供了一种与 [Kubernetes API Aggregation Layer](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) 类似的 API 拓展机制，提供声明式的 API 注册机制。

示例与字段说明：

```yaml
apiVersion: kubesphere.io/v1alpha1
kind: APIService
metadata:
  name: v1alpha1.devops.kubesphere.io
spec:
  group: devops.kubesphere.io
  version: v1alpha1                                      
  nonResourceURLs: []
  url: https://ks-devops.kubesphere-devops-system.svc  
# caBundle: ""
# insecureSkipTLSVerify: true
# service:
#   namespace: kubesphere-devops-system
#   name: ks-devops
#   path: /v1alpha1
#   port: 80
```


| 字段 | 描述 |
| --- | ---|
| `spec.group`、`spec.version` | 创建 APIService 类型的 CR 会向 ks-apiserver 动态注册 API，其中`spec.group`、`spec.version`表示所注册的API路径中的 API Group 与 API Version，请参考 [API 概念](zh/understand-kubesphere/api-concepts/) |
| `spec.nonResourceURLs` | 除了资源型的 API，也可以借助 APIService 注册非资源型的 API |
| `spec.url`、`spec.insecureSkipTLSVerify`、`spec.caBundle`| 可以为 APIervice 指定外部服务，将 API 请求代理到指定的 endpoint，请参考 [Endpoint](https://github.com/kubesphere/kubesphere/blob/feature-pluggable/staging/src/kubesphere.io/api/extensions/v1alpha1/types.go#L40-L49) |
| `spec.service` | 与 `spec.url` 类似，可以为 API 指定 K8s 集群内部的服务引用地址，请参考 [ServiceReference](https://github.com/kubesphere/kubesphere/blob/feature-pluggable/staging/src/kubesphere.io/api/extensions/v1alpha1/types.go#L21-L38) |


### JSBundle

JSBundle 定义了需要注入到前端框架中的 js 扩展包。`ks-console ` 会自动加载此类资源，实现动态功能扩展。

示例与字段说明：

```yaml
apiVersion: kubesphere.io/v1alpha1
kind: JSBundle
metadata:
  name: v1alpha1.devops.kubesphere.io
  annotations:
    meta.helm.sh/release-name: devops-0.10.0  
spec:
# filenameOverride: "index.js"
# raw: ""
  rawFrom:
    url: https://ks-devops.kubesphere-devops-system.svc/dist/devops.kubesphere.io/v1alpha1/index.js
  # caBundle: ""
  # configMapKeyRef:
  #   name: devops
  #   key: index.js
  #   namespace: kubesphere-devops-system
  # secretKeyRef:
  #   name: 
  #   key: 
  #   namespace: kubesphere-devops-system
```

| 字段 | 描述 |
| --- | ---|
| `spec.raw`、`spec.rawFrom.configMapKeyRef`、`spec.rawFrom.secretKeyRef` | 为了便于开发，体积较小的 js 文件可以直接在 CR 中进行定义或者直接嵌入到 ConfigMap 或 Secret 中 |
| `spec.rawFrom.url` | 体积较大的 js 文件则需要通过额外的后端服务来提供，扩展组件被启用之后，`ks-console` 会自动注入该扩展包 |


### ReverseProxy

提供灵活的 API 反向代理声明，支持 Rewrite、Redirect、请求头注入、熔断、限流等高级配置。

示例与字段说明：

```yaml
apiVersion: kubesphere.io/v1alpha1
kind: ReverseProxy
metadata:
  name: devops.kubesphere.io
spec:
  matcher:
  - path: /res/devops.kubesphere.io/images/*
    method: GET
  upstream:
    insecureSkipVerify: false
    caBudle: <Base64Data>
    backend: https://ks-devops.kubesphere-system.svc
    healthCheck:
      url: /healthz
      interval: 15s
      status: 200
      timeout: 15s
  rewrite:
    - '/old-prefix/* /new-prefix{path}'
  header:
    up:
    - 'Foo: Bar'
    down:
    - 'Foo: Bar'
```

| 字段 | 描述 |
| --- | ---|
| `spec.matcher` | API 的匹配规则，可以用来拦截特定的请求 |
| `spec.upstream` | 定义具体的服务后端，支持健康检查、TLS配置 |
| `spec.rewrite` | 请求路径的 rewrite |
| `spec.header` | 请求头的注入，这在后端服务需要额外的认证信息时非常有用 |


## 扩展组件的开发与打包

在开发过程中，通过创建上述类型的 CR，我们可以在[部署完成的 KubeSphere 4.0 开发环境](zh/get-started/deploy-kubesphere-4.0/)中向 `ks-apiserver` 灵活的注册 API、静态资源代理，并通过 JSBundle 前端扩展包，注入新的页面、导航菜单。在此基础之上我们需要使用 Docker、与 Helm 完成扩展组件的编排与打包。

通过开 ksbuilder 发者工具我们可以初始化一个扩展组件仓库项目，扩展组件仓库项目目录结构示例：

```bash
devops/
├── .helmignore  
├── Chart.yaml              # Helm chart、扩展组建基本信息
├── LICENSE     
├── README.md   
├── values.yaml             # 默认的配置信息
├── charts/      
└── templates/   
    ├── workloads.yaml      # 需要部署的工作负载
    ├── services.yaml       # 需要创建的 service 
    ├── extensions.yaml     # 定义 APIService、JSBundle、ReverseProxy
    ├── roletemplates.yaml  # 通过 role template 动态注册权限控制项
    └── tests/
logging/                    # 一个扩展组建仓库项目下，可以同时打包发布多个扩展组件
├── .helmignore  
├── Chart.yaml   
├── LICENSE     
├── README.md    
├── values.yaml  
├── charts/      
└── templates/   
    ├── workloads.yaml     
    ├── services.yaml      
    ├── extensions.yaml     
    ├── roletemplates.yaml
    └── tests/
Dockerfile # 将 charts 打包到 docker image 中作为扩展组件仓库进行发布
```

其中 Chart.yaml 中包含了扩展组件元信息，字段示例：

```yaml
apiVersion: v2
name: devops
version: v0.10.0
kubeVersion: v1.17.0
description: DevOps Extension for KubeSphere.
type: application
keywords:
  - DevOps    # 分类、关键字
home: https://kubesphere.io
sources:
  - https://github.com/kubesphere/ks-devops
dependencies: # chart 必要条件列表 （可选）
  - name: jenkins
    version: v0.0.1
    # repository: （可选）仓库URL () 或别名 ("@repo-name")
    # condition: （可选） 解析为布尔值的yaml路径，用于启用/禁用chart (e.g. subchart1.enabled )
    # tags:  （可选）
    #   - 用于一次启用/禁用 一组chart的tag
    # import-values:  （可选）
    #   - ImportValue 保存源值到导入父键的映射。每项可以是字符串或者一对子/父列表项
    # alias: （可选） chart中使用的别名。当你要多次添加相同的chart时会很有用
maintainers: 
  - name: kubesphere
    email: rick@Kubesphere.io
    url: https://github.com/linuxsuren
icon: 'data:image/png;base64, <Base64Encoded Image>'
appVersion: v0.10.0
annotations:
  extensions.kubesphere.io/foo: bar # 额外的注释信息
```

扩展组件根目录中 `Dockerfile` 的作用是通过 Docker 将项目下多个扩展组件 Helm Chart 打包到 Docker Image 中进行分发

```docker
FROM baseimage # 由 KubeSphere 提供的 baseimage，包含 chartmuseum 等依赖工具
WORKDIR /charts
COPY . /charts
RUN helm index . 
CMD ["serve"] # Helm Repo Serve，提供静态资源、Helm Repo 相关的 API
```

## 扩展组件的分发

通过 Docker Image 将编排为 Helm Chart 的一组扩展组件进行打包之后，可以借助 Docker Image 来分发我们开发的扩展组件。为了便于扩展组件的分发管理，KubeSphere 中包含了以下资源定义：


### Category

Category 声明了需要渲染到前端页面的扩展组件分类信息

```yaml
apiVersion: kubesphere.io/v1alpha1
kind: Category
metadata:
  name: devops
spec:
  displayName: "DevOps"
  description: "DevOps"
  icon: ""
```

### Repository

Repository 用于声明需要加载到 KubeSphere 中包含扩展组件包的 Docker Image，称之为扩展组件仓库。

示例与字段说明：

```yaml
apiVersion: kubesphere.io/v1alpha1
kind: Repository
metadata:
  name: builtin
spec:
  image: docker.io/kubespheredev/builtin:latest # 内置的仓库
  displayName: Builtin Repository
  publisher: admin@kubesphere.io
  updateStrategy: # 仓库的更新策略
    registryPoll:
      interval: 10m 
```

ks-controller-manager 会将扩展组件仓库中声明的 Docker Image 作为工作负载在 K8s 集群中部署，从部署的工作负载中可以通过预设的 API 获取到打包为 Helm Chart 扩展组件包中的元数据，扩展组件仓库会根据预设策略定时更新（重新拉取镜像，同步扩展组件信息）。


## 扩展组件的生命周期管理

当我们通过 Repository 声明了需要同步到 KubeSphere 中的扩展组件仓库之后，ks-controller-manager 会从预设 Docker Image 中获取扩展组件包(Chart)的元数据，经过数据校验、转换，同时写入 Extension、ExtensionVersion 对象，用以实现扩展组件发现、版本控制相关的功能。具体的示例如下：

###  Extension

Extension CR 声明了从扩展组件包(Chart)中解析出的基础元数据信息，Chart 的 name 会作为 Extension 的 ID，Extension ID 仅允许被相同的 Repository 所管理。

```yaml
apiVersion: kubesphere.io/v1alpha1
kind: Extension
metadata:
  name: devops
  labels:
    extensions.kubesphere.io/category=devops
spec:
  displayName: "DevOps"
  description: DevOps Extension for KubeSphere.
  icon: ""
  maintainers:
  - email: "devops.kubesphere.io"
    name: "kubesphere"
    url: "https://kubesphere.io"
status:
  state: deployed
  subscribedVersion: v0.10.1
  recommendVersion: v0.10.1
  versions:
  - version: 0.10.0
    minKubeVersion: 1.17.0
  - version: 0.10.1
    minKubeVersion: 1.17.0
```

### ExtensionVersion

ExtensionVersion CR 中包含了详细的不同版本的扩展组件包的元数据信息

```yaml
apiVersion: kubesphere.io/v1alpha1
kind: ExtensionVersion
metadata:
  name: devops-v0.10.1
spec:
  displayName: "DevOps"
  description: DevOps Extension for KubeSphere.
  icon: ""
  maintainers:
  - email: "devops.kubesphere.io"
    name: "kubesphere"
    url: "https://kubesphere.io"
  repo: builtin
  version: 0.10.0
  minKubeVersion: 1.17.0
  sources: "https://github.com/kubesphere/ks-devops"
  digest: "7easdasa5bb6a6859ce6f9f1cdb3dd6821addc6e5193080d9d444faa1a631"
```

### Subscription

通过订阅的方式对扩展组件的声明周期进行管理，通过 Subscription CR 来控制扩展组件的安装卸载，启用、停用、配置变更、状态同步、版本升级。

```yaml
apiVersion: kubesphere.io/v1alpha1
kind: Subscription
metadata:
  name: devops-0.10.0
spec:
  enabled: true
  extension:
    name: devops 
    version: 0.10.0  # 通过更新版本触发 upgrade, rollback
  targetNamespace: kubesphere-devops-system
  config:
    foo: bar # 扩展组件的配置信息
```

