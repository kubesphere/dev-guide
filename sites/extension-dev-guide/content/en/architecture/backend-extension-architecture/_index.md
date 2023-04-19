---
title: Backend extensions
weight: 2
description: Describes KubeSphere backend extensions.
---

In KubeSphere LuBan, the mechanism for backend extensions includes API dynamic proxies, static proxies, and extension lifecycle management. The Core module of KubeSphere retains the following three major components:

* `ks-apiserver`: an extensible API gateway that provides KubeSphere with unified API authentication, proxy forwarding of requests, and API aggregation capabilities.
* `ks-controller-manager`: implements the logic for critical resource management.
* `ks-console`: provides a web UI for KubeSphere.

Built on top of Kubernetes, KubeSphere enables data storage, caching, and synchronization based on custom resources. For more information, see [Custom resources in Kubernetes](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

![backend-extension-arch](./backend-arch.svg)

## Principles

You can use the following custom resource definitions (CRDs) to register APIs, extend frontend functionalities, and configure dynamic agents.

### APIService

Provides a declarative API registration mechanism similar to [Kubernetes API Aggregation Layer](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).

Sample code:

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


| Parameter                                                 | Description                                                                                                                                                                                                                                                                                                      |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `spec.group`, `spec.version`                              | When you create a custom resource of the APIService type, KubeSphere automatically registers the API with ks-apiserver, in which `spec.group` and `spec.version` represent the API Group and API Version in the registered API path. For more information, see [API concepts](../../references/kubesphere-api/). |
| `spec.url`, `spec.caBundle`, `spec.insecureSkipTLSVerify` | Specify an external service for APIService, and route API requests to the specified endpoint. For more information, see [Endpoints](https://github.com/kubesphere/kubesphere/blob/feature-pluggable/staging/src/kubesphere.io/api/extensions/v1alpha1/types.go#L49-L58).                                         |
| `spec.service`                                            | Specify the internal service reference URL for the API, which is similar to `spec.url`. For more information, see [ ServiceReference](https://github.com/kubesphere/kubesphere/blob/feature-pluggable/staging/src/kubesphere.io/api/extensions/v1alpha1/types.go#L30-L47).                                       |


### JSBundle

Defines the extension bundle that needs to be injected into the front-end framework. `ks-console` will automatically load such resources to extend the functionality.

Sample code:

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