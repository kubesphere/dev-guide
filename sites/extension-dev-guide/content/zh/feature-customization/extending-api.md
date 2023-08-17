---
title: API 扩展
weight: 02
description: 介绍如何扩展 API
---

## API 扩展

KubeSphere 构建在 K8s 之上，和 K8s 一样是高度可配置和可扩展的，除了可以借助 [K8s 的扩展机制](https://kubernetes.io/docs/concepts/extend-kubernetes/)来扩展 KubeSphere 的平台能力之外，KubeSphere 还提供了更为灵活的扩展方式，您可以创建以下几种类型的 [CR](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) 向 KubeSphere 注册 API、扩展前端 UI 或者创建动态资源代理。


在开始之前，您需要先了解：[KubeSphere API 概念](https://dev-guide.kubesphere.io/extension-dev-guide/zh/references/kubesphere-api-concepts/)

通过 KubeSphere 提供的 API 扩展方式，您可以便捷的使用 KubeSphere 中的访问控制，多租户，多集群等能力。

KubeSphere 中 API 扩展主要有以下两种方式，他们适用于不同的场景：

### APIService

KubeSphere 提供了一种与 [Kubernetes API Aggregation Layer](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) 类似的 API 拓展机制，提供声明式的 API 注册机制。

API Service 是一种严格的声明式 API 的定义方式，通过 API Group、API Version、Resource 以及 API 路径中定义的资源层级紧密的和 KubeSphere 的访问控制、多租户权限管理体系相结合。

对于可以抽象成声明式资源的 API，这是一种非常适用的扩展方式。

以 [employee 示例扩展组件为例](https://dev-guide.kubesphere.io/extension-dev-guide/zh/examples/employee-management-extension-example/) ，我们可以为 employee 扩展组件分配特定的 API Group 和 API Version，当请求匹配 `/kapi/{spec.group}/{spec.version}` 路径时，会将请求转发到 `{spec.url}`。

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
| `spec.group`、`spec.version` | 创建 APIService 类型的 CR 会向 ks-apiserver 动态注册 API，其中`spec.group`、`spec.version`表示所注册的API路径中的 API Group 与 API Version |
| `spec.url`、`spec.caBundle`、`spec.insecureSkipTLSVerify`| 可以为 APIService 指定外部服务，将 API 请求代理到指定的 endpoint |
| `spec.service` | 与 `spec.url` 类似，可以为 API 指定 K8s 集群内部的服务引用地址 |

如果您需要进一步对 API 的访问权限进行管理，请参阅：[扩展组件访问控制](https://dev-guide.kubesphere.io/extension-dev-guide/zh/feature-customization/access-control/)。

### ReverseProxy

提供灵活的 API 反向代理声明，支持 rewrite、redirect、请求头注入、熔断、限流等配置。

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

## 针对 CRD 的 API 扩展

如果您已经借助 K8s CRD 定义了 API，在 KubSphere 中 K8s 提供的 API 可以直接使用。在此基础之上，还可以借助 KubeSphere 对您的 API 进行增强。

### 多集群

`/clusters/{cluster}/apis/{group}/{version}/resources`

通过 `/clusters/{cluster}` 前缀可以直接访问特定集群中的资源

### 访问控制

CRD 中已经定义的资源层级 cluster 或者 namespaced 同样适用。

### 分页与模糊搜索

`kapis` 是 KubeSphere API 的前缀，您可以将 CRD 打上 `kubesphere.io/resource-served: 'true'`，这意味着 KubeSphere 将提供相关 CR 资源的分页、模糊查询 API。

**注意:** KubeSphere Served Resource API 会与 APIService 产生冲突（如果适用了相同的 API Group 与 API Version）。


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
| labelSelector  | 标签选择器                                          | 否    |                   | 与 K8s 中 labelSelector 一样的处理方式，可参考：[labels#api](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#api) |
| fieldSelector  | 属性选择器，支持'=', '==', '!='，多个用英文逗号分隔。从根开始查询所有路径属性 | 否    |                   | fieldSelector=spec.ab=true,spec.bc!=ok                                                                                        |

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