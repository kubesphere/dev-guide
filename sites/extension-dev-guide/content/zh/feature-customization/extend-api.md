---
title: 扩展资源 API 
weight: 08
description: 介绍扩展资源 API
---

在开发扩展组件时有可能会用到 CRD(CustomResourceDefinition)，用到 CRD 就可能有分页查询的需求，但原生 K8s API 对资源的分页查询支持灵活性比较欠缺。于是我们在 ks-core 中内置了对 CRD 扩展资源操作的 API，除了分页查询还支持了增删改的 API，相比 K8s API 用起来更灵活更方便。

## 扩展方式

在对应的 CRD 上加 labels：`kubesphere.io/resource-served: "true"`。

若是 ks-core 中的资源则只需把该 GVK 注册到 schema 中即可，不需在 CRD 上加这 label。

## API 概要

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

操作不同级别的资源时设置对应参数需要和该级别的前缀共存。比如，

操作 namespace 级别的资源：

`/kapis/clusters/{cluster}/{group}/{version}/namespaces/{namespace}/{resources}`

操作 workspace 级别的资源：

`/kapis/clusters/{cluster}/{group}/{version}/workspaces/{workspace}/{resources}`

操作 cluster 级别的资源：

`/kapis/clusters/{cluster}/{group}/{version}/{resources}`



下面将介绍 API 详情操作，其中省略了操作不同级别资源的描述。



## API 详情

### get CR

#### HTTP 请求

GET /kapis/{group}/{version}/{resources}/{name}

#### 参数

**name** （**路径参数**）：string，必需，CR 的名称

#### 响应

200 (CustomResource): OK

401: Unauthorized

### list 分页查询 CR

#### HTTP 请求

GET /kapis/{group}/{version}/{resources}

#### 参数

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

#### 响应

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

说明：根据 page, limit 查询参数和返回值中 remainingItemCount 就可计算得总数据。



401: Unauthorized

### create CR

#### HTTP 请求

POST /kapis/{group}/{version}/{resources}

#### 参数

body: CustomResource, 必须

#### 响应

200 : OK

401: Unauthorized

409: Conflict

### update  CR

#### HTTP 请求

PUT /kapis/{group}/{version}/{resources}

#### 参数

body: CustomResource, 必须

#### 响应

200 : OK

401: Unauthorized

### patch  CR

#### HTTP 请求

PATCH /kapis/{group}/{version}/{resources}

#### 参数

body: CustomResource, 必须

#### 响应

200 : OK

401: Unauthorized

### delete CR

#### HTTP 请求

DELETE /kapis/{group}/{version}/{resources}/{name}

#### 参数

**name** （**路径参数**）：string，必需，CR 的名称

#### 响应

200 : OK

401: Unauthorized

404: Not Found
