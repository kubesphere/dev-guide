---
title: API Extension
weight: 02
description: Describes how to extend the API.
---

## Extend API

KubeSphere offers flexible methods to extend its API, supporting the creation of various types of [Custom Resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) to register APIs or create dynamic proxy rules.

Before getting started, please check out [KubeSphere API Concepts](../../references/kubesphere-api-concepts/), or view the [access control](../access-control/) section to learn more about API access control.

In KubeSphere, there are primarily two ways for API extension, each with different usage scenarios.

### APIService

KubeSphere has an API extension mechanism similar to the [Kubernetes API Aggregation Layer](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/), with a declarative API registration mechanism.

The APIService is a strictly declarative API definition that is tightly integrated with KubeSphere's access control and multi-tenant privilege management system through the resource hierarchy defined in the API Group, API Version, Resource, and API Path. It is very suitable for APIs that can be abstracted into declarative resources.

**APIService examples and parameters:**

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

| Field | Description |
| --- | ---|
| `spec.group`</br> `spec.version` | Creating a CR of APIService type dynamically registers the API into ks-apiserver, where `spec.group` and `spec.version` represent the API Group and API version in the registered API path. |
| `spec.url`</br> `spec.caBundle`</br> `spec.insecureSkipTLSVerify`|  They specify an external service for APIService, and proxy the API request to the specified endpoint. |
| `spec.service` | Similar to `spec.url`, it specifies the service reference address inside the K8s cluster for the API. |

> By defining the backend's endpoint through `spec.service`, TLS is enabled by default. If you need to specify an HTTP service address, you should explicitly set the scheme to `http` through `spec.url`.


### ReverseProxy

It provides flexible API reverse proxy declaration, and supports configurations such as rewrite, redirect, request header injection, circuit breaker, and current limit.

`ks-apiserver` should be used as a reverse proxy, and the following webpack configuration needs to be added when running KubeSphere Console locally:

**webpack.config.js：**

```js
const { merge } = require('webpack-merge');
const baseConfig = require('@ks-console/bootstrap/webpack/webpack.dev.conf');

const webpackDevConfig = merge(baseConfig, {
  devServer: {
    proxy: {
      '/proxy': {
        target: 'http://172.31.73.3:30881', // Modify it to the address of the target `ks-apiserver`.
        onProxyReq: (proxyReq, req, res) => {
            const username = 'admin'        // User credentials for the request proxy.
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

**ReverseProxy examples and parameters:**

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

| Field | Description |
| --- | ---|
| `spec.matcher` | It defines API matching rules, which can be used to intercept specific requests. |
| `spec.upstream` | It defines specific service backends, supporting health check and TLS configuration. |
| `spec.directives` | It injects different directives into the request chain. |

#### Directives

 `method` shows the HTTP request method.

```yaml
spec:
  directives:
    method: 'POST'
```

`stripPathPrefix` removes the prefix in the request path.

```yaml
spec:
  directives:
    stripPathPrefix: '/path/prefix'
```

`stripPathSuffix` removes the suffix in the request path.

```yaml
spec:
  directives:
    stripPathSuffix: '.html'
```

`headerUp` adds, removes or replaces headers for requests sent to upstream.

```yaml
spec:
  directives:
    headerUp:
    - '-Authorization'
    - 'Foo bar'
```

`headerDown` adds, removes or replaces headers for responses returned from upstream.

```yaml
spec:
  directives:
    headerDown:
    - 'Content-Type "application/json"'
```

`rewrite` rewrites the request path and query parameters sent to the upstream.

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

`replace` replaces the request path sent to the upstream.

```yaml
spec:
  directives:
    replace:
    - /docs/ /v1/docs/

# - "/docs/ /v1/docs/" ==> rewrite "/docs/go" to "/v1/docs/go"
```

`pathRegexp` uses regular expressions to replace the request path sent to the upstream.

```yaml
spec:
  directives:
    pathRegexp:
    - /{2,} /

# - "/{2,} /" ==> rewrite "/doc//readme.md" to "/doc/readme.md"
```

`authProxy` forwards user authentication-related request headers to the upstream service.

```yaml
spec:
  directives:
    authProxy: true
```

The upstream service will receive the following request headers:

```text
X-Remote-Group: system:authenticated
X-Remote-User: admin
```

## API extension for CRD

If you have defined an API with the help of K8s CRD, you can directly use the API provided by K8s in KubSphere. On top of this, you can also enhance your API with the help of KubeSphere.

### Multi-cluster

Through the `ks-apiserver` of the KubeSphere host cluster, you can proxy access resources in each member cluster. The API mode is as follows: `/clusters/{cluster}/apis/{group}/{version}/resources`

Resources in a specific cluster can be accessed through the `/clusters/{cluster}` prefix.

### Access control

KubeSphere API supports multi-level access control, and the API path design should strictly adhere to the [KubeSphere API Concepts](../../references/kubesphere-api-concepts/). User access permissions often need to be coordinated with the frontend; please refer to the [Access Control](../access-control/) section for details.

### Pagination and fuzzy search

Add the `kubesphere.io/resource-served: 'true'` Label for CRD, and KubeSphere will provide the pagination and fuzzy query API for related CR resources.

> If the same API Group and API Version are used, the priority of APIService is higher than that of the KubeSphere Served Resource API.

**Request examples and parameters**

Cluster resources: `GET /clusters/{cluster}/kapis/{apiGroup}/{apiVersion}/{resources}`

Workspace resources: `GET /clusters/{cluster}/kapis/{apiGroup}/{apiVersion}/workspaces/{workspace}/{resources}`

Namespace resources: `GET /clusters/{cluster}/kapis/{apiGroup}/{apiVersion}/namespaces/{namespace}/{resources}`

| Query Parameter | Description | Required | Default Value | Remarks |
|---------------|-----------------|--------|---------------------|------------------------|
| page | Page number | No | 1 | |
| limit | Page width | No | -1 | 
| sortBy | Sorting field, which can be name, createTime, creationTimestamp | No | creationTimestamp | |
| ascending | Ascending | No | false | |
| name | Resource name, support fuzzy search | No | | |
| names | A collection of resource names, separated by commas | No | | |
| uid | Resource uid | No | | |
| namespace | namespace | No | | |
| ownerReference | ownerReference | No | | |
| ownerKind | ownerKind | No | | |
| annotation | Annotation, support '=', '!=', a single annotation, key-value pair or a single key | No | | annotation=ab=ok or annotation=ab |
| labelSelector | Label selector, used in the same way as K8s labelSelector, refer to [labels#api](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#api) | No | | labelSelector=environment in (production,qa), tier in (frontend) |
| fieldSelector | Attribute selector, support '=', '==', '!=', separated by commas. Query all path properties from the root. <br/> Case-insensitive, values need to be prefixed with `~` | No   |     | fieldSelector=spec.ab=true,spec.bc!=ok    <br/> Case-insensitive: fieldSelector=spec.ab=~ok,spec.bc!=~ok |        


**Response**:

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