---
title: KubeSphere API Concepts
weight: 5
description: KubeSphere API Concepts
---

As a superset of the Kubernetes API, the KubeSphere API follows the design of the Kubernetes API, which is a resource-based (RESTful) programmatic interface provided via HTTP. It supports retrieving, creating, updating, and deleting primary resources through standard HTTP verbs, such as POST, PUT, PATCH, DELETE, and GET.

To get started with the KubeSphere API,  **you need to read and understand the** [Kubernetes API Concepts](https://kubernetes.io/zh-cn/docs/reference/using-api/api-concepts/) first.

KubeSphere 提供了 K8s 的 API 代理，可以通过 `/apis`、`/api` 前缀直接访问 K8s 的 API。KubeSphere 在 K8s 的基础之上支持额外的资源层级：平台级（如用户、集群、企业空间等资源属于这个层级），企业空间级。KubeSphere 扩展的 API 通常以 `/kapis` 为前缀。

Examples:
* `/api/v1/namespaces`
* `/api/v1/pods`
* `/api/v1/namespaces/my-namespace/pods`
* `/apis/apps/v1/deployments`
* `/apis/apps/v1/namespaces/my-namespace/deployments`
* `/apis/apps/v1/namespaces/my-namespace/deployments/my-deployment`
* `/kapis/iam.kubesphere.io/v1beta1/users`
* `/kapis/tenant.kubesphere.io/v1alpha2/workspaces/my-workspace/namespaces`


### Multiple clusters

KubeSphere 支持 K8s 多集群纳管，您可以通过 API 直接访问 member 集群，只需要在请求路径之前添加集群标识作为前缀。

Examples:
* `/clusters/host/api/v1/namespaces`
* `/clusters/member/api/v1/namespaces`
