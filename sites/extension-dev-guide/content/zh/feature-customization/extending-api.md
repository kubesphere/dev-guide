---
title: API 扩展
weight: 02
description: 介绍如何扩展 API
---

## API 扩展

KubeSphere 提供灵活的 API 扩展方式，支持创建以下几种类型的 [Custom Resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)，以注册 API 或创建动态的代理规则。

在开始之前，请先了解 [KubeSphere API 概念](../references/kubesphere-api-concepts/)，或查看[访问控制](../access-control/)章节，了解更多有关 API 访问控制的内容。

在 KubeSphere 中，API 扩展主要有以下两种方式，它们适用于不同的场景。

### APIService

KubeSphere 提供了一种类似于 [Kubernetes API Aggregation Layer](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) 的 API 扩展机制，使用声明式的 API 注册机制。

API Service 是一种严格的声明式 API 定义方式，通过 API Group、API Version、Resource，以及 API 路径中定义的资源层级，与 KubeSphere 的访问控制和多租户权限管理体系紧密结合。对于那些可以抽象成声明式资源的 API，这是一种非常适用的扩展方式。

以 weave-scope 扩展组件为例，可以为其分配特定的 API Group 和 API Version。当请求匹配 `/kapi/{spec.group}/{spec.version}` 路径时，该请求将会被转发到 `{spec.url}`。

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
#   namespace: extension-employee
#   name: apiserver
#   port: 80
```

| 字段 | 描述 |
| --- | ---|
| `spec.group`、`spec.version` | 创建 APIService 类型的 CR 会向 ks-apiserver 动态注册 API，其中`spec.group`、`spec.version`表示所注册的 API 路径中的 API Group 与 API Version |
| `spec.url`、`spec.caBundle`、`spec.insecureSkipTLSVerify`| 为 APIService 指定外部服务，将 API 请求代理到指定的 endpoint |
| `spec.service` | 与 `spec.url` 类似，为 API 指定 K8s 集群内部的服务引用地址 |

若要进一步管理 API 的访问权限，请参阅：[访问控制](../access-control/)。

### ReverseProxy

它提供灵活的 API 反向代理声明，支持 rewrite、redirect、请求头注入、熔断、限流等配置。

以 weave-scope 配置为例，此配置表示将所有请求路径前缀为 `/proxy/weave.works`  的请求转发到指定的上游服务: `http://weave-scope-app.weave.svc`，并移除请求头中的 Authorization 字段和请求路径中的前缀 `/proxy/weave.works`。

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

| 字段 | 描述 |
| --- | ---|
| `spec.matcher` | API 的匹配规则，可以用来拦截特定的请求 |
| `spec.upstream` | 定义具体的服务后端，支持健康检查、TLS配置 |
| `spec.directives` | 向请求链注入不同的指令 |

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

6. `rewrite` 重写发送到上游的请求路径以及查询参数

```yaml
spec:
  directives:
    rewrite:
    - * /foo.html
    - /api/* ?a=b
    - /api_v2/* ?{query}&a=b
    - * /index.php?{query}&p={path}

# - "* /foo.html" ==> rewrite "/" to "/foo.html"
# - "/api/* ?a=b" ==> rewrite "/api/abc" to "/api/abc?a=b"
# - "/api_v2/* ?{query}&a=b" ==> rewrite "/api_v2/abc" to "/api_v2/abc?a=b"
# - "* /index.php?{query}&p={path}" ==> rewrite "/foo/bar" to "/index.php?p=%2Ffoo%2Fbar"
```

7. `replace` 替换发送到上游的请求路径

```yaml
spec:
  directives:
    replace:
    - /docs/ /v1/docs/

# - "/docs/ /v1/docs/" ==> rewrite "/docs/go" to "/v1/docs/go"
```

8. `pathRegexp` 正则替换发送到上游的请求路径

```yaml
spec:
  directives:
    pathRegexp:
    - /{2,} /

# - "/{2,} /" ==> rewrite "/doc//readme.md" to "/doc/readme.md"
```

## 针对 CRD 的 API 扩展

如果您已经借助 K8s CRD 定义了 API，在 KubSphere 中可以直接使用 K8s 提供的 API。此外，还可以利用 KubeSphere 增强您的 API。

### 多集群

`/clusters/{cluster}/apis/{group}/{version}/resources`

通过 `/clusters/{cluster}` 前缀可以直接访问特定集群中的资源。

### 访问控制

同样适用于 CRD 中已经定义的资源层级 cluster 或者 namespace。

### 分页与模糊搜索

`kapis` 是 KubeSphere API 的前缀，若将 CRD 配置为 `kubesphere.io/resource-served: 'true'`，这表示 KubeSphere 会为相关的 CR 资源提供分页和模糊查询 API 等功能。

**注意**: 如果使用了相同的 API Group 与 API Version，KubeSphere Served Resource API 会与 APIService 产生冲突。

**API 请求**

`GET /clusters/{cluster}/kapis/{apiGroup}/{apiVersion}/(namespaces/{banesoaces}/)?{resources}`

| 参数             | 描述                                             | 是否必须 | 默认值               | 备注                                                                                                                            |
|----------------|------------------------------------------------|------|-------------------|-------------------------------------------------------------------------------------------------------------------------------|
| page           | 页码                                             | 否    | 1                 |                                                                                                                               |
| limit          | 页宽                                             | 否    | -1                |                                                                                                                               |
| sortBy         | 排序字段，支持 name, createTime,creationTimestamp     | 否    | creationTimestamp |                                                                                                                               |
| ascending      | 升序                                             | 否    | false             |                                                                                                                               |
| name           | 资源名，支持模糊搜索                                     | 否    |                   |                                                                                                                               |
| names          | 资源名集合，多个用英文逗号分开                                | 否    |                   |                                                                                                                               |
| uid            | 资源 uid                                         | 否    |                   |                                                                                                                               |
| namespace      | namespace                                      | 否    |                   |                                                                                                                               |
| ownerReference | ownerReference                                 | 否    |                   |                                                                                                                               |
| ownerKind      | ownerKind                                      | 否    |                   |                                                                                                                               |
| annotation     | 注解，支持‘=’, '!='，单个annotation，键值对或单个键            | 否    |                   | annotation=ab=ok或annotation=ab                                                                                                |
| label     | 注解，支持‘=’, '!='，单个 label，键值对或单个键            | 否    |                   |  label=ab=ok或label=ab                                                                                                |
| ~~labelSelector~~  | 标签选择器(暂未支持)                                          | 否    |                   | 与 K8s 中 labelSelector 一样的处理方式，可参考：[labels#api](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#api) |
| fieldSelector  | 属性选择器，支持'=', '==', '!='，多个用英文逗号分隔，从根开始查询所有路径属性 | 否    |                   | fieldSelector=spec.ab=true,spec.bc!=ok                                                                                        |

**API 响应**

```json
{
    "apiVersion":"{Group}/{Version}",
    "items":[],
    "kind":"{CR}List",
    "metadata":{
        "continue":"",
        "remainingItemCount":0, 
        "resourceVersion":""
    }
}
```
