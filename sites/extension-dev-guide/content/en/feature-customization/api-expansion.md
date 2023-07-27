---
title: API Extensions
weight: 06
description: Describes how to extend the API
---

## API Extensions

After the API backend development completes, the API should be registered in the KubeSphere API extension, and be exposed and processed by KubeSphere uniformly, so that there is no need to deal with common operations such as authentication any more. In addition, when you access services of extensions, it is impossible to configure Endpoints for each service, which will be too cumbersome and inconvenient to manage. These configurations can then be managed in API extensions. The KubeSphere API extension module can be seem as an API gateway. The extended API only needs to focus on its own business logic, and then access the KubeSphere platform through the API extension.

There are two main methods for API extension, each with different usage scenarios:

### APIService

This method is commonly used for **custom-developed extensions**, which connects the extension API to the platform.

For example, after developing the backend API of the employee extension, the prefix of the backend API is `/kapis/employee.kubesphere.io/v1alpha1`, and the endpoint of the deployed service is `http://employee-api.default.svc:8080`. The following configurations can be made:

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
#insecureSkipTLSVerify: false

# service:
# namespace: example-system
# name: apiserver
# port: 80
```

During routing processing, the request: `/kapi/{spec.group}/{spec.version}` will be routed to the configuration `{spec.url}`. It is to route the request prefixed with `/kapis/employee.kubesphere.io/v1alpha1` to the `http://employee-api.default.svc:8080` service.

It can also be configured as spec.service when specifying the route service. If the https protocol needs certificate configurations, see [APIService](https://dev-guide.kubesphere.io/extension-dev-guide/zh/architecture/backend-extension-architecture/#apiservice for more configuration methods).

### ReverseProxy

This method is commonly used for **accessing three-party components**. Considering factors such as security and the need for special processing of requests and URLs, you can use a reverse proxy to connect the extension API to the platform.

The configuration of accessing the weave-scope system is as follows:

```yaml
apiVersion: extensions.kubesphere.io/v1alpha1
kind: ReverseProxy
metadata:
   name: weave-scope
spec:
   directives:
     headerUp:
     - -Authorization
     stripPathPrefix: /proxy/weave.worKubeSphere
   matcher:
     method: '*'
     path: /proxy/weave.worKubeSphere/*
   upstream:
     url: http://weave-scope-app.weave.svc

# service:
# namespace: example-system
# name: apiserver
# port: 443
```

This configuration means that all requests with a path prefix of `/proxy/weave.works` are forwarded to the specified upstream service: `http://weave-scope-app.weave.svc`, and the Authorization field in the request header and the prefix `/proxy/weave. works` in the request path are removed.

In addition, it supports advanced configurations such as rewrite, redirect, request header injection, circuit breaking, and traffic limiting. For more configuration methods, see [ReverseProxy](https://dev-guide.kubesphere.io/extension-dev-guide/zh/ architecture/backend-extension-architecture/#reverseproxy).