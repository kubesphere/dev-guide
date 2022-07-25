---
title: 后端可插拔架构
weight: 214
description: KubeSphere 后端可插拔架构介绍
---

后端的插件化主要包含 API 的动态注册、静态资源的代理、插件的生命周期管理三个部分。可以把 `ks-apiserver` 看作一个可拓展的 API 网关，提供统一的 API 认证鉴权、请求的代理转发能力。`ks-controller-manager` 则提供了插件的生命周期管理能力。

KubeSphere 构建在 Kubernetes 之上，借助 [Kubernetes 提供的拓展能力](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)实现了基本的数据存储、缓存同步等功能。

![backend](/images/pluggable-arch/backend-arch.svg)

我们定义了以下 CRD 用来对插件模型进行抽象：

### APIService

KubeSphere 提供了一种与 [Kubernetes API Aggregation Layer](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) 类似的 API 拓展机制，提供声明式的 API 注册机制。

示例与字段说明：

```yaml
apiVersion: extensions.kubesphere.io/v1alpha1
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
| `spec.group`、`spec.version` | 创建 APIService 类型的 CR 会向 ks-apiserver 动态注册 API，其中`spec.group`、`spec.version`表示所注册的API路径中的 API Group 与 API Version，请参考 [API 概念](../../understand-kubesphere/api-concepts/) |
| `spec.nonResourceURLs` | 除了资源型的 API，也可以借助 APIService 注册非资源型的 API |
| `spec.url`、`spec.insecureSkipTLSVerify`、`spec.caBundle`| 可以为 APIervice 指定外部服务，将 API 请求代理到指定的 endpoint，请参考 [Endpoint](https://github.com/kubesphere-sigs/kubesphere/blob/feature-pluggable/staging/src/kubesphere.io/api/extensions/v1alpha1/types.go#L40-L49) |
| `spec.service` | 与 `spec.url` 类似，可以为 API 指定 K8s 集群内部的服务引用地址，请参考 [ServiceReference](https://github.com/kubesphere-sigs/kubesphere/blob/feature-pluggable/staging/src/kubesphere.io/api/extensions/v1alpha1/types.go#L21-L38) |


### JSBundle

JSBundle 定义了需要注入到前端框架中的 js bundle。ks-console 会 watch 此类资源，实现动态的路由注册。

示例与字段说明：

```yaml
apiVersion: extensions.kubesphere.io/v1alpha1
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
| `spec.rawFrom.url` | 体积较大的 js 文件则需要通过额外的后端服务来提供，插件被启用之后，ks-console 会自动注入该 bundle 文件 |


### ReverseProxy

提供透明的 API 反向代理声明，支持 Rewrite、请求头注入等高级网关配置，相比 APIService 可以实现更为灵活的 API 注册，使用此类资源时需要注意 API 的冲突。

示例与字段说明：

```yaml
apiVersion: extensions.kubesphere.io/v1alpha1
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