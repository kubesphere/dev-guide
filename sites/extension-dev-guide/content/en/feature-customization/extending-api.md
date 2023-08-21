---
title: API Extensions
weight: 02
description: Describes how to extend the API.
---

## Extend API

 Built on K8s, KubeSphere LuBan is highly configurable and extensible like K8s. In addition to extending KubeSphere capabilities with the help of the [K8s extension mechanism](https://kubernetes.io/docs/concepts/extend-kubernetes/), KubeSphere offers a more flexible way to extend the platform by creating the following types of [CRs](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources) to register APIs with KubeSphere, extend the front-end UI, or create dynamic resource proxies.

Before you start, you should learn: [KubeSphere API Concepts](https://dev-guide.kubesphere.io/extension-dev-guide/en/references/kubesphere-api-concepts/).

With KubeSphere API extensions, you can easily utilize the access control, multi-tenancy, and multi-cluster capabilities of KubeSphere.

There are two main methods for API extension in KubeSphere, each with different usage scenarios:

### APIService

KubeSphere has an API extension mechanism similar to the [Kubernetes API Aggregation Layer](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/), with a declarative API registration mechanism.

The API Service is a strictly declarative API definition that is tightly integrated with KubeSphere's access control and multi-tenant privilege management system through the resource hierarchy defined in the API Group, API Version, Resource, and API Path.

It is very suitable for APIs that can be abstracted into declarative resources.

Taking the [employee management extension](https://dev-guide.kubesphere.io/extension-dev-guide/en/examples/employee-management-extension-example/) as an example, you can assign specific API Group and API Version to it, when the request matches the `/kapi/{spec.group}/{spec.version}` path, the request will be forwarded to `{spec.url}`.

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

| Field | Description |
| --- | ---|
| `spec.group`, `spec.version` | Creating a CR of APIService type dynamically registers the API into ks-apiserver, where `spec.group` and `spec.version` represent the API Group and API version in the registered API path. |
| `spec.url`, `spec.caBundle`, `spec.insecureSkipTLSVerify`|  They specify an external service for APIService, and proxy the API request to the specified endpoint. |
| `spec.service` | Similar to `spec.url`, it specifies the service reference address inside the K8s cluster for the API. |

If you need to further manage API access permissions, please refer to: [Access Control](https://dev-guide.kubesphere.io/extension-dev-guide/en/feature-customization/access-control/ ).

### ReverseProxy

It provides flexible API reverse proxy declaration, and supports configurations such as rewrite, redirect, request header injection, circuit breaker, and current limit.

Take the weave-scope configuration as an example, the below configuration means forwarding all requests whose path prefix is `/proxy/weave.works` to the specified upstream service: `http://weave-scope-app.weave.svc`, and remove the Authorization field in the request header and the prefix `/proxy/weave.works` in the request path.

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

| Field | Description |
| --- | ---|
| `spec.matcher` | It defines API matching rules, which can be used to intercept specific requests. |
| `spec.upstream` | It defines specific service backends, supporting health check and TLS configuration. |
| `spec.directives` | It injects different directives into the request chain. |

#### Directives

1. `method` shows the HTTP request method.

```yaml
spec:
  directives:
    method: 'POST'
```

2. `stripPathPrefix` removes the prefix in the request path.

```yaml
spec:
  directives:
    stripPathPrefix: '/path/prefix'
```

3. `stripPathSuffix` removes the suffix in the request path.

```yaml
spec:
  directives:
    stripPathSuffix: '.html'
```

4. `headerUp` adds, removes or replaces headers for requests sent to upstream.

```yaml
spec:
  directives:
    headerUp:
    - '-Authorization'
    - 'Foo bar'
```

5. `headerDown` adds, removes or replaces response headers for responses returned from upstream.

```yaml
spec:
  directives:
    headerDown:
    - 'Content-Type "application/json"'
```

## API extension for CRD

If you have defined an API with the help of K8s CRD, you can directly use the API provided by K8s in KubSphere. On top of this, you can also enhance your API with the help of KubeSphere.

### Multi-cluster

`/clusters/{cluster}/apis/{group}/{version}/resources`

Resources in a specific cluster can be directly accessed through the `/clusters/{cluster}` prefix.

### Access control

It is also applicable for the resource level "cluster" or "namespaced" already defined in the CRD.

### Pagination and fuzzy search

`kapis` is the prefix of KubeSphere API, you can mark the CRD with `kubesphere.io/resource-served: 'true'`, which means that KubeSphere will provide the pagination and fuzzy query API for related CR resources.

**Note:** KubeSphere Served Resource API will conflict with APIService (if the same API Group and API Version are applied).


**API Request**

`GET /clusters/{cluster}/kapis/{apiGroup}/{apiVersion}/(namespaces/{banesoaces}/)?{resources}`

| Parameter | Description | Required | Default Value | Remarks |
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
| labelSelector | Label selector | No | | The same processing method as labelSelector in K8s, please refer to: [labels#api](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#api) |
| fieldSelector | Attribute selector, support '=', '==', '!=', separated by commas. Query all path properties from the root | No | | fieldSelector=spec.ab=true,spec.bc!=ok |

**API Response**

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