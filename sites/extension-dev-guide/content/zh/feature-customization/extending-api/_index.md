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

APIService 是一种严格的声明式 API 定义方式，通过 API Group、API Version、Resource，以及 API 路径中定义的资源层级，与 KubeSphere 的访问控制和多租户权限管理体系紧密结合。对于那些可以抽象成声明式资源的 API，这是一种非常适用的扩展方式。

**APIService 示例与参数说明：**

```yaml
apiVersion: extensions.kubesphere.io/v1alpha1
kind: APIService
metadata:
  name: v1alpha1.example.kubesphere.io
spec:
  group: example.kubesphere.io
  version: v1alpha1                                      
  url: http://apiserver.example.svc

# caBundle: <Base64EncodedData>
# insecureSkipTLSVerify: false

# service:
#   namespace: example
#   name: apiserver
#   port: 443
```

| 字段 | 描述 |
| --- | ---|
| `spec.group`</br>`spec.version` | 创建 APIService 类型的 CR 会向 ks-apiserver 动态注册 API，其中`spec.group`、`spec.version`表示所注册的 API 路径中的 API Group 与 API Version |
| `spec.url`</br>`spec.caBundle`</br>`spec.insecureSkipTLSVerify`| 为 APIService 指定外部服务，将 API 请求代理到指定的 endpoint |
| `spec.service` | 与 `spec.url` 类似，为 API 指定 K8s 集群内部的服务引用地址 |

> 通过 `spec.service` 定义后端的 endpoint 默认需要启用 TLS，如需指定 HTTP 服务地址，需要通过 `spec.url` 显式指定 scheme 为 `http`。

### ReverseProxy

提供灵活的 API 反向代理声明，支持 rewrite、redirect、请求头注入、熔断、限流等配置。

需要用到 ks-apiserver 做反向代理，本地运行 KubeSphere Console 时需要增加如下 webpack 配置：

**webpack.config.js：**

```js
const { merge } = require('webpack-merge');
const baseConfig = require('@ks-console/bootstrap/webpack/webpack.dev.conf');

const webpackDevConfig = merge(baseConfig, {
  devServer: {
    proxy: {
      '/proxy': {
        target: 'http://172.31.73.3:30881', // 修改为目标 ks-apiserver 的地址
        onProxyReq: (proxyReq, req, res) => {
            const username = 'admin'        // 请求代理时的用户凭证
            const password = 'P@88w0rd'
            const auth = Buffer.from(`${username}:${password}`).toString("base64");
            proxyReq.setHeader('Authorization', `Basic ${auth}`);
          },
      },
    },
  },
});

module.exports = webpackDevConfig;
```

**ReverseProxy 示例与参数说明：**

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
    url: http://app.weave.svc

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

`method` 修改 HTTP 请求方法

```yaml
spec:
  directives:
    method: 'POST'
```

`stripPathPrefix` 移除请求路径中的前缀

```yaml
spec:
  directives:
    stripPathPrefix: '/path/prefix'
```

`stripPathSuffix` 移除请求路径中的后缀

```yaml
spec:
  directives:
    stripPathSuffix: '.html'
```

`headerUp` 为发送到上游的请求增加、删除或替换请求头

```yaml
spec:
  directives:
    headerUp:
    - '-Authorization'
    - 'Foo bar'
```

`headerDown` 为上游返回的响应增加、删除或替换响应头

```yaml
spec:
  directives:
    headerDown:
    - 'Content-Type "application/json"'
```

`rewrite` 重写发送到上游的请求路径以及查询参数

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

`replace` 替换发送到上游的请求路径

```yaml
spec:
  directives:
    replace:
    - /docs/ /v1/docs/

# - "/docs/ /v1/docs/" ==> rewrite "/docs/go" to "/v1/docs/go"
```

`pathRegexp` 正则替换发送到上游的请求路径

```yaml
spec:
  directives:
    pathRegexp:
    - /{2,} /

# - "/{2,} /" ==> rewrite "/doc//readme.md" to "/doc/readme.md"
```

`authProxy` 向上游服务传递用户认证相关的请求头

```yaml
spec:
  directives:
    authProxy: true
```

上游服务会收到如下请求头

```text
X-Remote-Group: system:authenticated
X-Remote-User: admin
```

## 针对 CRD 的 API 扩展

如果您已经借助 K8s CRD 定义了 API，在 KubSphere 中可以直接使用 K8s 提供的 API。此外，还可以利用 KubeSphere 增强您的 API。

### 多集群

通过 KubeSphere host 集群的 ks-apiserver 可以代理访问各 member 集群的资源，API 模式如下： `/clusters/{cluster}/apis/{group}/{version}/{resources}`

通过 `/clusters/{cluster}` 前缀可以指定访问特定集群中的资源。

### 访问控制

KubeSphere API 支持多级访问控制，需要在 API 路径设计上严格遵循[KubeSphere API 的设计模式](../references/kubesphere-api-concepts/)。用户访问权限往往需要与前端联动，请参考[访问控制](../access-control/)章节。

### 分页与模糊搜索

为 CRD 添加 Label `kubesphere.io/resource-served: 'true'`，KubeSphere 会为相关的 CR 资源提供分页和模糊查询 API 等功能。

默认生成的 List API 模式为: `/clusters/{cluster}/kapis/{apiGroup}/{apiVersion}/(namespaces/{namespace}/)?{resources}`

> 如果使用了相同的 API Group 与 API Version，APIService 的优先级高于 KubeSphere Served Resource API。

**请求示例与参数说明：**

`GET /clusters/{cluster}/kapis/{apiGroup}/{apiVersion}/(namespaces/{namespace}/)?{resources}`

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

**响应：**

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
