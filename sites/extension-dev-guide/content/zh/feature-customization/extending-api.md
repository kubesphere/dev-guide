---
title: API 扩展
weight: 02
description: 介绍如何扩展 API
---

## API 扩展

后端完成 API 开发后，需要将 API 注册到 KS API 扩展中由 KS 统一对外暴露和处理，这样就不用单独处理鉴权等通用操作。另外我们在访问各个扩展的服务时，不可能单独为每个服务都配置各自 Endpoint 去访问，这样会太过于繁琐且不便于管理。于是就可以通过在 API 扩展中管理这些配置。可以将 KS API 扩展模块理解为一个 API 网关，扩展的 API 只需关注各自的业务逻辑，然后通过 API 扩展接入到 KS 平台。

API 扩展主要有两种方式，分别有不同的使用场景：

### APIService

这种方式常见于**自定义开发的扩展组件**，将扩展组件的 API 接入平台。

比如开发了 employee 后端 API 后，后端 API 前缀为 `/kapis/employee.kubesphere.io/v1alpha1` ，部署的服务的 Endpoint 为 `http://employee-api.default.svc:8080`，我们可以进行如下配置：

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

路由处理时会将请求： `/kapi/{spec.group}/{spec.version}` 路由到这个配置中 `{spec.url}` 上。就是将 `/kapis/employee.kubesphere.io/v1alpha1` 前缀的请求路由到 `http://employee-api.default.svc:8080` 服务上处理。

指定路由的服务时也可以配置成 spec.service。若是 https 协议还需进行证书的相关配置，更多配置方式见 [APIService](https://dev-guide.kubesphere.io/extension-dev-guide/zh/architecture/backend-extension-architecture/#apiservice)。

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

此配置表示将所有请求路径前缀为 `/proxy/weave.works`  的请求转发到指定的上游服务: `http://weave-scope-app.weave.svc`，并移除请求头中的 Authorization 字段和请求路径中的前缀 `/proxy/weave.works`。

除此之外支持 rewrite、redirect、请求头注入、熔断、限流等高级配置，更多配置方式见[ReverseProxy](https://dev-guide.kubesphere.io/extension-dev-guide/zh/architecture/backend-extension-architecture/#reverseproxy)。

在开发扩展组件时有可能会用到 CRD(CustomResourceDefinition)，用到 CRD 就可能有分页查询的需求，但原生 K8s API 对资源的分页查询支持灵活性比较欠缺。于是我们在 ks-core 中内置了对 CRD 扩展资源操作的 API，除了分页查询还支持了增删改的 API，相比 K8s API 用起来更灵活更方便。

## 资源 API 扩展

### 扩展方式

在对应的 CRD 上加 labels：`kubesphere.io/resource-served: "true"`。

若是 ks-core 中的资源则只需把该 GVK 注册到 schema 中即可，不需在 CRD 上加这 label。

### API 概要

**URL格式：**

`/kapis/clusters/{cluster}/{group}/{version}/workspaces/{workspace}/namespaces/{namespace}/{resources}`

| 参数        | 类型     | 含义     | 是否必须 | 备注                                                     |
| --------- | ------ | ------ | ---- | ------------------------------------------------------ |
| group     | string | API 分组 | 是    |                                                        |
| version   | string | API 版本 | 是    |                                                        |
| resources | string | API 资源 | 是    | API 资源的复数形式                                            |
| cluster   | string | 集群名    | 是    | 操作指定集群上的资源需要设置此值，4.0 默认多集群模式，默认用到该参数                   |
| workspace | string | 企业空间名  | 否    | 操作 workspace 级别的资源需要设置此值，在创建资源时为该资源设置上 workspace label |
| namespace | string | 命名空间名  | 否    | 操作 namespace 级别的资源需要设置此值                               |

操作不同级别的资源时，设置对应参数需要和该级别的前缀共存。比如，

操作 namespace 级别的资源：

`/kapis/clusters/{cluster}/{group}/{version}/namespaces/{namespace}/{resources}`

操作 workspace 级别的资源：

`/kapis/clusters/{cluster}/{group}/{version}/workspaces/{workspace}/{resources}`

操作 cluster 级别的资源：

`/kapis/clusters/{cluster}/{group}/{version}/{resources}`



下面将介绍 API 详情操作，其中省略了操作不同级别资源的描述。



### API 详情

#### get CR

##### HTTP 请求

GET /kapis/{group}/{version}/{resources}/{name}

##### 参数

**name** （**路径参数**）：string，必需，CR 的名称

##### 响应

200 (CustomResource): OK

401: Unauthorized

#### list 分页查询 CR

##### HTTP 请求

GET /kapis/{group}/{version}/{resources}

##### 参数

查询参数：

| 参数             | 类型     | 描述                                             | 是否必须 | 默认值               | 备注                                                                                                                           |
| -------------- | ------ | ---------------------------------------------- | ---- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| page           | int    | 页码                                             | 否    | 1                 |                                                                                                                              |
| limit          | int    | 页宽                                             | 否    | -1                |                                                                                                                              |
| sortBy         | string | 排序字段，支持 name, createTime,creationTimestamp     | 否    | creationTimestamp |                                                                                                                              |
| ascending      | bool   | 升序                                             | 否    | false             |                                                                                                                              |
| name           | string | 资源名                                            | 否    |                   |                                                                                                                              |
| names          | string | 资源名集合，多个用英文逗号分开                                | 否    |                   |                                                                                                                              |
| uid            | string | 资源 uid                                         | 否    |                   |                                                                                                                              |
| namespace      | string | namespace                                      | 否    |                   |                                                                                                                              |
| ownerReference | string | ownerReference                                 | 否    |                   |                                                                                                                              |
| ownerKind      | string | ownerKind                                      | 否    |                   |                                                                                                                              |
| annotation     | string | 注解，支持‘=’, '!='，单个annotation，键值对或单个键            | 否    |                   | annotation=ab=ok或annotation=ab                                                                                               |
| label          | string | 标签，支持‘=’, '!='，单个label，键值对或单个键                 | 否    |                   | label=kubesphere.io/workspace=system-workspace 或 label=kubesphere.io/workspace                                               |
| labelSelector  | string | 标签选择器                                          | 否    |                   | 与 K8s 中 labelSeletor 一样的处理方式，可参考：[labels#api](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#api) |
| fieldSelector  | string | 属性选择器，支持'=', '==', '!='，多个用英文逗号分隔。从根开始查询所有路径属性 | 否    |                   | fieldSelector={field path}={field name}。fieldSelector=spec.ab=true,spec.bc!=ok                                               |

##### 响应

200 (CustomResourceList): OK



```json
{
    "apiVersion":"group/version",
    "items":[],
    "kind":"{CR}List",
    "metadata":{
        "continue":"",
        "remainingItemCount":0, // 剩余的数据
        "resourceVersion":""
    }
}
```

> 说明：根据 page, limit 查询参数和返回值中 remainingItemCount 就可计算得总数据。



401: Unauthorized

#### create CR

##### HTTP 请求

POST /kapis/{group}/{version}/{resources}

##### 参数

body: CustomResource, 必须

##### 响应

200 : OK

401: Unauthorized

409: Conflict

#### update  CR

##### HTTP 请求

PUT /kapis/{group}/{version}/{resources}

##### 参数

body: CustomResource, 必须

##### 响应

200 : OK

401: Unauthorized

#### patch  CR

##### HTTP 请求

PATCH /kapis/{group}/{version}/{resources}

##### 参数

body: CustomResource, 必须

##### 响应

200 : OK

401: Unauthorized

#### delete CR

##### HTTP 请求

DELETE /kapis/{group}/{version}/{resources}/{name}

##### 参数

**name** （**路径参数**）：string，必需，CR 的名称

##### 响应

200 : OK

401: Unauthorized

404: Not Found