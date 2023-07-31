---
title: API Extensions
weight: 06
description: Describes how to extend the API.
---

## Extend API

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

## Extend resource API

CRD (CustomResourceDefinition) may be required for developing extensions. When using CRD, there may be a need for paging query, but the native K8s API lacks flexibility in supporting paging query of resources. Therefore, we built an API for CRD extended resource operations in ks-core. In addition to paging queries, it also supports addition, deletion, and modification, which is more flexible and convenient than the K8s API.

### Extension method

Add labels to the corresponding CRD: `kubesphere.io/resource-served: "true"`.

If it is a resource in ks-core, you only need to register the GVK in the schema, and there is no need to add the label to the CRD.

### API overview

**URL format:**

`/kapis/clusters/{cluster}/{group}/{version}/workspaces/{workspace}/namespaces/{namespace}/{resources}`

| Parameter | Type | Meaning | Required | Remarks |
| --------- | ------ | ------ | ---- | ---------- |
| group | string | API group | yes | |
| version | string | API version | yes | |
| resources | string | API resources | yes | The plural form of API resources |
| cluster | string | cluster name | yes | This value should be set if you have to operate resources on a specified cluster. The ks-core 4.0 uses multi-cluster mode by default, so this parameter should be used by default. |
| workspace | string | Workspace name | No | This value should be set if you have to operate workspace-level resources, and the workspace label should be set for the resource when creating resources. |
| namespace | string | Namespace name | No | This value should be set if you have to operate namespace-level resources. |

For resources of different levels, the corresponding parameters should be coexist with the prefix of the level. For example,

For namespace-level resources:

`/kapis/clusters/{cluster}/{group}/{version}/namespaces/{namespace}/{resources}`

For workspace-level resources:

`/kapis/clusters/{cluster}/{group}/{version}/workspaces/{workspace}/{resources}`

For cluster-level resources:

`/kapis/clusters/{cluster}/{group}/{version}/{resources}`

Below introduces the API details, and descriptions for resources of different levels are omitted.


### API details

#### get CR

##### HTTP request

GET /kapis/{group}/{version}/{resources}/{name}

##### Parameters

**name** (**path parameter**): string, required, the name of the CR

##### Responses

200 (Custom Resource): OK

401: Unauthorized

#### CR for list paging query

###### HTTP request

GET /kapis/{group}/{version}/{resources}

##### Parameters

Query parameters:

| Parameter | Type | Description | Required | Default Value | Remarks |
| -------------- | ------ |-------------------------- | ---- | ----------------- | -------|
| page | int | page number | no | 1 | |
| limit | int | page width | no | -1 | |
| sortBy | string | sort field, support name, createTime, and creationTimestamp | no | creationTimestamp | |
| ascending | bool | ascending | no | false | |
| name | string | resource name | no | | |
| names | string | collection of resource names, separated by commas | No | | |
| uid | string | resource uid | no | | |
| namespace | string | namespace | no | | |
| ownerReference | string | ownerReference | No | | |
| ownerKind | string | ownerKind | no | | |
| annotation | string | annotation, support '=', '!=', a single annotation, key-value pair or a single key | no | | annotation=ab=ok or annotation=ab |
| label | string | label, support '=', '!=', a single label, key-value pair or a single key | no | | label=kubesphere.io/workspace=system-workspace or label=kubesphere.io/workspace |
| labelSelector | string | label selector | No | | The same processing method as labelSelector in K8s, please refer to: [labels#api](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#api) |
| fieldSelector | string | attribute selector, support '=', '==', '!=', separated by commas. It queries all path attributes from root. | no | | fieldSelector={field path}={field name}. fieldSelector=spec.ab=true,spec.bc!=ok|

##### Responses

200 (CustomResourceList): OK



```json
{
     "apiVersion": "group/version",
     "items": [],
     "kind":"{CR}List",
     "metadata": {
         "continue": "",
         "remainingItemCount":0, // remaining data
         "resourceVersion": ""
     }
}
```

> Note: The total data can be calculated according to the page, limit query parameters and remainingItemCount in the returned value.



401: Unauthorized

#### create CR

##### HTTP request

POST /kapis/{group}/{version}/{resources}

##### Parameters

body: CustomResource, required

##### Responses

200 : OK

401: Unauthorized

409: Conflict

#### update CR

##### HTTP request

PUT /kapis/{group}/{version}/{resources}

##### Parameters

body: CustomResource, required

##### Responses

200 : OK

401: Unauthorized

#### patch CR

##### HTTP request

PATCH /kapis/{group}/{version}/{resources}

##### Parameters

body: CustomResource, required

##### Responses

200 : OK

401: Unauthorized

#### delete CR

##### HTTP request

DELETE /kapis/{group}/{version}/{resources}/{name}

##### Parameters

**name** (**path parameter**): string, required, the name of the CR

##### Responses

200 : OK

401: Unauthorized

404: Not Found