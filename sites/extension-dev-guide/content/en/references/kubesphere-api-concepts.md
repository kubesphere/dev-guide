---
title: KubeSphere API Concepts
weight: 5
description: KubeSphere API Concepts
---

As a superset of the Kubernetes API, the KubeSphere API follows the design of the Kubernetes API, which is a resource-based (RESTful) programmatic interface provided via HTTP. It supports retrieving, creating, updating, and deleting primary resources through standard HTTP verbs, such as POST, PUT, PATCH, DELETE, and GET.

To get started with the KubeSphere API,  **you need to read and understand the** [Kubernetes API Concepts](https://kubernetes.io/zh-cn/docs/reference/using-api/api-concepts/) first.

KubeSphere provides a proxy for accessing the Kubernetes API, and users can access the Kubernetes AP directly by using prefixes such as `/apis` and `/api`. Moreover, KubeSphere supports more resource hierarchies: platform  (consisting of users, clusters, and workspace resources) and workspace. KubeSphere extension APIs usually use the `/kapis` prefix.

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

KubeSphere supports the management of multiple Kubernetes clusters. You can access member clusters via the API by simply using a cluster tag as the prefix of a request path.

Examples:
* `/clusters/host/api/v1/namespaces`
* `/clusters/member/api/v1/namespaces`
