---
title: KubeSphere API Concepts
weight: 5
description: KubeSphere API Concepts
---

As a superset of the Kubernetes API, the KubeSphere API follows the design of the Kubernetes API, which is a resource-based (RESTful) programmatic interface provided via HTTP. It supports retrieving, creating, updating, and deleting primary resources through standard HTTP verbs, such as POST, PUT, PATCH, DELETE, and GET.

To get started with the KubeSphere API,  **you need to read and understand the** [Kubernetes API Concepts](https://kubernetes.io/zh-cn/docs/reference/using-api/api-concepts/) first.

KubeSphere provides the API proxy for k8s, which can directly access K8s API through `/apis`, `/api` prefix. KubeSphere supports additional resource levels on the basis of K8s: platform level (resources such as users, clusters, and workspaces), and workspace level. APIs for KubeSphere extensions are usually prefixed with `/kapis`.

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

KubeSphere supports K8s multi-cluster management. You can directly access member clusters through the API, just add the cluster ID as a prefix before the request path.

Examples:
* `/clusters/host/api/v1/namespaces`
* `/clusters/member/api/v1/namespaces`
