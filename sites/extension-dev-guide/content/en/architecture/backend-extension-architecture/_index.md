---
title: Backend Extensions
weight: 2
description: Describes KubeSphere backend extensions.
---

KubeSphere LuBan is built on K8s, which is highly configurable and extensible like K8s. Except using the [K8s extension mechanism ](https://kubernetes.io/docs/concepts/extend-kubernetes/) to extend the platform capabilities of KubeSphere, KubeSphere also provides a more flexible way for extension, you can create the following types of [CR](https://kubernetes.io/docs/concepts/extend -kubernetes/api-extension/custom-resources/) to register API with KubeSphere, extend frontend UI or create dynamic resource proxy.

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


| Parameter                                                 | Description                                                                                                                                                                                                                          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `spec.group`, `spec.version`                              | When you create a custom resource of the APIService type, KubeSphere automatically registers the API with ks-apiserver, in which `spec.group` and `spec.version` represent the API Group and API Version in the registered API path. |
| `spec.url`, `spec.caBundle`, `spec.insecureSkipTLSVerify` | Specify an external service for APIService to proxy API requests to the specified endpoint                                                                                                                                           |
| `spec.service`                                            | Similar to `spec.url`, specify the service reference address inside the K8s cluster for the API                                                                                                                                      |


### JSBundle

Defines the extension bundle that needs to be injected into the front-end framework. `ks-console` will automatically load such resources to implement the UI dynamic extension.

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