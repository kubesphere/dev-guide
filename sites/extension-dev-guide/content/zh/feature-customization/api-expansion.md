---
title: API 扩展
weight: 06
description: 介绍如何扩展 API
---

## API 扩展

后端完成 API 开发后，需要将 API 注册到 KS API 扩展中由 KS 统一对外暴露和处理，这样就不用单独处理鉴权等通用操作。另外我们在访问各个扩展的服务时不可能单独为每个服务都配置各自 Endpoint 去访问，这样会太过于繁琐且不便于管理。于是就可以通过在 API 扩展中管理这些配置。可以将 KS API 扩展模块理解为一个 API 网关，扩展的 API 只需关注各自的业务逻辑，然后通过 API 扩展接入到 KS 平台。

API 扩展主要有两种方式，分别有不同的使用场景：

### APIService

这种方式常见于**自定义开发的扩展组件**，将扩展组件的 API 接入平台。

比如开发了 employee 后端 API 后，后端 API 前缀为 `/kapis/employee.kubesphere.io/v1alpha1` ，部署的服务的 Endpoint 为 `http://employee-api.default.svc:8080` 我们可以进行如下配置：

```yaml
apiVersion: extensions.kubesphere.io/v1alpha1
kind: APIService
metadata:
  name: v1alpha1.employee.kubesphere.io
spec:
  group: employee.kubesphere.io
  version: v1alpha1                                      
  url: http://employee-api.default.svc:8080

# caBundle: <Base64EncodedData>
# insecureSkipTLSVerify: false

# service:
#   namespace: example-system
#   name: apiserver
#   port: 80
```

路由处理时会将请求： `/kapi/{spec.group}/{spec.version}` 路由到这个配置中 `{spec.url}` 上。这儿就是将 `/kapis/employee.kubesphere.io/v1alpha1` 前缀的请求路由到 `http://employee-api.default.svc:8080` 服务上处理。

这儿指定路由的服务时也可以配置成 spec.service，若是 https 协议还需配置证书相关配置，更多配置方式见 [APIService](https://dev-guide.kubesphere.io/extension-dev-guide/zh/architecture/backend-extension-architecture/#apiservice)。

### ReverseProxy

这种方式常见于**接入三方组件**，考虑到安全性、需要对请求及 URL 进行特殊的处理等因素，可以用反向代理的方式将扩展组件 API 接入平台。

如下接入 weave-scope 三方系统的配置：

```yaml
apiVersion: extensions.kubesphere.io/v1alpha1
kind: ReverseProxy
metadata:
  name: weave-scope
spec:
  directives:
    headerUp:
    - -Authorization
    stripPathPrefix: /proxy/weave.works
  matcher:
    method: '*'
    path: /proxy/weave.works/*
  upstream:
    url: http://weave-scope-app.weave.svc

#   service:
#     namespace: example-system
#     name: apiserver
#     port: 443
```

此配置会将所有 `/proxy/weave.works/*` 请求路径前缀的 URL 的所有方法经过它处理，并且会移除请求头中 Authorization，然后把 `/proxy/weave.works` 请求路径前缀移除，将处理后的请求路由到 spec.upstream.url 对应的 `http://weave-scope-app.weave.svc` url 中处理。

除此之外支持 rewrite、redirect、请求头注入、熔断、限流等高级配置，更多配置方式见[ReverseProxy](https://dev-guide.kubesphere.io/extension-dev-guide/zh/architecture/backend-extension-architecture/#reverseproxy)。
