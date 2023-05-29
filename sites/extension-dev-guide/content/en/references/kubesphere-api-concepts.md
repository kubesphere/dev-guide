---
title: KubeSphere API 概念
weight: 5
description: KubeSphere API 概念
---

KubeSphere API 是 K8s API 的超集，沿用了 K8s API 的设计，通过 HTTP 提供了基于资源 (RESTful) 的编程接口。 它支持通过标准 HTTP 动词（POST、PUT、PATCH、DELETE、GET）检索、创建、更新和删除主要资源。

**您需要先阅读并理解** [K8s API 的概念](https://kubernetes.io/zh-cn/docs/reference/using-api/api-concepts/)。

KubeSphere 提供了 K8s 的 API 代理，可以通过 `/apis`、`/api` 前缀直接访问 K8s 的 API，KubeSphere 在 K8s 的基础之上支持额外的资源层级：平台级（如用户、集群、企业空间等资源属于这个层级），企业空间级，KubeSphere 扩展的 API 通常以 `/kapis` 为前缀。

例如:
* `/api/v1/namespaces`
* `/api/v1/pods`
* `/api/v1/namespaces/my-namespace/pods`
* `/apis/apps/v1/deployments`
* `/apis/apps/v1/namespaces/my-namespace/deployments`
* `/apis/apps/v1/namespaces/my-namespace/deployments/my-deployment`
* `/kapis/iam.kubesphere.io/v1beta1/users`
* `/kapis/tenant.kubesphere.io/v1alpha2/workspaces/my-workspace/namespaces`


### Multiple clusters

KubeSphere 支持 K8s 多集群纳管，您可以通过 API 直接访问 member 集群，只需要在请求路径之前添加集群标识作为前缀，

例如:
* `/clusters/host/api/v1/namespaces`
* `/clusters/member/api/v1/namespaces`
