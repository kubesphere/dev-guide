---
title: Backend extensions
weight: 2
description: Describes KubeSphere backend extensions.
---

KubeSphere LuBan 构建在 K8s 之上，和 K8s 一样是高度可配置和可扩展的，除了可以借助 [K8s 的扩展机制](https://kubernetes.io/docs/concepts/extend-kubernetes/)来扩展 KubeSphere 的平台能力之外，KubeSphere 还提供了更为灵活的扩展方式，您可以创建以下几种类型的 [CR](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) 向 KubeSphere 注册 API、扩展前端 UI或者创建动态资源代理。

## APIService

Provides a declarative API registration mechanism similar to [Kubernetes API Aggregation Layer](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).

Sample code:

```yaml
apiVersion: extensions.kubesphere.io/v1alpha1
kind: APIService
metadata:
  name: v1alpha1.example.com
spec:
  group: example.com
  version: v1alpha1                                      
  url: https://apiserver.example-system.svc  
# caBundle: <Base64EncodedData>
# insecureSkipTLSVerify: false
# service:
#   namespace: example-system
#   name: apiserver
#   port: 80
```


| Parameter                                                 | Description                                                                                                      |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `spec.group`, `spec.version`                              | 创建 APIService 类型的 CR 会向 ks-apiserver 动态注册 API，其中`spec.group`、`spec.version`表示所注册的API路径中的 API Group 与 API Version |
| `spec.url`, `spec.caBundle`, `spec.insecureSkipTLSVerify` | 可以为 APIService 指定外部服务，将 API 请求代理到指定的 endpoint                                                                    |
| `spec.service`                                            | 与 `spec.url` 类似，可以为 API 指定 K8s 集群内部的服务引用地址                                                                       |


### JSBundle

Defines the extension bundle that needs to be injected into the front-end framework. `ks-console` 会自动加载此类资源，实现 UI 的动态扩展。

Sample code:

```yaml
apiVersion: extensions.kubesphere.io/v1alpha1
kind: JSBundle
metadata:
  name: v1alpha1.example.com
spec:
# filenameOverride: "index.js"
# raw: ""
  rawFrom:
    url: https://apiserver.example-system.svc/dist/example.com/v1alpha1/index.js
  # caBundle: ""
  # configMapKeyRef:
  #   name: example
  #   key: index.js
  #   namespace: example-system
  # secretKeyRef:
  #   name: example
  #   key: index.js
  #   namespace: example-system
```

| Parameter                                                               | Description                                                                                                                                                    |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `spec.raw`, `spec.rawFrom.configMapKeyRef`, `spec.rawFrom.secretKeyRef` | For development, JavaScript files in small sizes can be directly defined in custom resources or embedded in ConfigMap or Secret.                               |
| `spec.rawFrom.url`                                                      | For JavaScript files in large sizes, additional backend services are required. If an extension is enabled, `ks-console` will automatically inject the package. |


### ReverseProxy

Provides flexible API reverse proxies, which supports advanced configurations such as rewrite, redirect, request header injection, circuit breaking, and flow control.

Sample code:

```yaml
apiVersion: extensions.kubesphere.io/v1alpha1
kind: ReverseProxy
metadata:
  name: v1alpha1.example.com
spec:
  matcher:
  - path: /proxy/example.com/images/*
    method: GET
  upstream:
    insecureSkipVerify: false
    caBudle: <Base64EncodedData>
    url: https://apiserver.example-system.svc
#   service:
#     namespace: example-system
#     name: apiserver
#     port: 443
  directives:
    stripPathPrefix: '/proxy/example.com'
    headerUp:
    - '-Authorization'
    headerDown:
    - 'Content-Type image/jpeg'
```

| Parameter         | Description                                                                            |
| ----------------- | -------------------------------------------------------------------------------------- |
| `spec.matcher`    | API matching rules, which can be used to intercept specific requests.                  |
| `spec.upstream`   | Defines a specific service backend, which supports health check and TLS configuration. |
| `spec.directives` | Injects different directives into requests.                                            |

#### Directives

1. `method`: modifies the HTTP request method.

```yaml
spec:
  directives:
    method: 'POST'
```

2. `stripPathPrefix`: removes prefixes from request paths.

```yaml
spec:
  directives:
    stripPathPrefix: '/path/prefix'
```

3. `stripPathSuffix`: removes suffixes from request paths.

```yaml
spec:
  directives:
    stripPathSuffix: '.html'
```

4. `headerUp`: adds, removes, or replaces request headers for upstream requests.

```yaml
spec:
  directives:
    headerUp:
    - '-Authorization'
    - 'Foo bar'
```

5. `headerDown`: adds, removes, or replaces response headers from upstream.

```yaml
spec:
  directives:
    headerDown:
    - 'Content-Type "application/json"'
```