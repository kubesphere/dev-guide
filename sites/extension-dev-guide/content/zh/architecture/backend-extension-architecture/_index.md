---
title: 后端扩展机制
weight: 02
description: KubeSphere 后端扩展机制介绍
---

KubeSphere LuBan 后端扩展机制主要包含 API 的动态代理、静态资源的代理、扩展组件的生命周期管理三个部分。KubeSphere Core 保留了以下三个核心组件：

* `ks-apiserver` KubeSphere API Server 是一个可扩展的 API 网关，为 KubeSphere 提供统一的 API 认证鉴权、请求的代理转发、API 的聚合能力。
* `ks-controller-manager` KubeSphere Controller Manager 实现了核心资源的控制逻辑。
* `ks-console` KubeSphere Console 为 KubeSphere 提供 Web UI。

KubeSphere 构建在 Kubernetes 之上，借助 [Kubernetes 提供的扩展能力](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)实现了基本的数据存储、缓存同步等功能。

![backend-extension-arch](./backend-arch.svg)

## 后端扩展机制原理

用户可以通过定义以下 CRD 向 KubeSphere 注册 API、前端扩展、动态资源代理，进而扩展 KubeSphere 的功能：

### APIService

KubeSphere 提供了一种与 [Kubernetes API Aggregation Layer](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) 类似的 API 拓展机制，提供声明式的 API 注册机制。

示例与字段说明：

```yaml
apiVersion: extensions.kubesphere.io/v1alpha1
kind: APIService
metadata:
  name: v1alpha1.example.kubesphere.io
spec:
  group: example.kubesphere.io
  version: v1alpha1                                      
  url: https://example.kubesphere-system.svc  
# caBundle: <Base64Data>
# insecureSkipTLSVerify: false
# service:
#   namespace: kubesphere-system
#   name: example
#   port: 80
```


| 字段 | 描述 |
| --- | ---|
| `spec.group`、`spec.version` | 创建 APIService 类型的 CR 会向 ks-apiserver 动态注册 API，其中`spec.group`、`spec.version`表示所注册的API路径中的 API Group 与 API Version，请参考 [API 概念](../../references/kubesphere-api/) |
| `spec.url`、`spec.caBundle`、`spec.insecureSkipTLSVerify`| 可以为 APIService 指定外部服务，将 API 请求代理到指定的 endpoint，请参考 [Endpoint](https://github.com/kubesphere/kubesphere/blob/feature-pluggable/staging/src/kubesphere.io/api/extensions/v1alpha1/types.go#L49-L58) |
| `spec.service` | 与 `spec.url` 类似，可以为 API 指定 K8s 集群内部的服务引用地址，请参考 [ServiceReference](https://github.com/kubesphere/kubesphere/blob/feature-pluggable/staging/src/kubesphere.io/api/extensions/v1alpha1/types.go#L30-L47) |


### JSBundle

JSBundle 定义了需要注入到前端框架中的扩展包。`ks-console` 会自动加载此类资源，实现功能动态扩展。

示例与字段说明：

```yaml
apiVersion: extensions.kubesphere.io/v1alpha1
kind: JSBundle
metadata:
  name: v1alpha1.example.kubesphere.io
spec:
# filenameOverride: "index.js"
# raw: ""
  rawFrom:
    url: https://example.kubesphere-system.svc/dist/example.kubesphere.io/v1alpha1/index.js
  # caBundle: ""
  # configMapKeyRef:
  #   name: example
  #   key: index.js
  #   namespace: kubesphere-system
  # secretKeyRef:
  #   name: example
  #   key: index.js
  #   namespace: kubesphere-system
```

| 字段 | 描述 |
| --- | ---|
| `spec.raw`、`spec.rawFrom.configMapKeyRef`、`spec.rawFrom.secretKeyRef` | 为了便于开发，体积较小的 js 文件可以直接在 CR 中进行定义或者直接嵌入到 ConfigMap 或 Secret 中 |
| `spec.rawFrom.url` | 体积较大的 js 文件则需要通过额外的后端服务来提供，扩展组件被启用之后，`ks-console` 会自动注入该扩展包 |


### ReverseProxy

提供灵活的 API 反向代理声明，支持 rewrite、redirect、请求头注入、熔断、限流等高级配置。

示例与字段说明：

```yaml
apiVersion: extensions.kubesphere.io/v1alpha1
kind: ReverseProxy
metadata:
  name: example.kubesphere.io
spec:
  matcher:
  - path: /res/example.kubesphere.io/images/*
    method: GET
  upstream:
    insecureSkipVerify: false
    caBudle: <Base64Data>
    url: https://example.kubesphere-system.svc
#   service:
#     namespace: kubesphere-system
#     name: example
#     port: 80
  directives:
    stripPathPrefix: '/res/example.kubesphere.io'
    headerUp:
    - '-Authorization'
    headerDown:
    - 'Content-Type image/jpeg'
```

| 字段 | 描述 |
| --- | ---|
| `spec.matcher` | API 的匹配规则，可以用来拦截特定的请求 |
| `spec.upstream` | 定义具体的服务后端，支持健康检查、TLS配置 |
| `spec.directives` | 可以向请求链注入不同的指令 |

#### Directives

1. `method` 修改 HTTP 请求方法

```yaml
spec:
  directives:
    method: 'POST'
```

2. `stripPathPrefix` 移除请求路径中的前缀

```yaml
spec:
  directives:
    stripPathPrefix: '/path/prefix'
```

3. `stripPathSuffix` 移除请求路径中的后缀

```yaml
spec:
  directives:
    stripPathSuffix: '.html'
```

4. `headerUp` 为发送到上游的请求增加、删除或替换请求头

```yaml
spec:
  directives:
    headerUp:
    - '-Authorization'
    - 'Foo bar'
```

5. `headerDown` 为上游返回的响应增加、删除或替换响应头

```yaml
spec:
  directives:
    headerDown:
    - 'Content-Type "application/json"'
```