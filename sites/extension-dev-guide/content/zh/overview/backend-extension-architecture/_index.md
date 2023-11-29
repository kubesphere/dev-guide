---
title: 后端扩展机制
weight: 03
description: 如何对 KubeSphere 的后端 API 进行扩展？
---

KubeSphere 构建在 K8s 之上，和 K8s 一样也具备高度可配置和可扩展的特性，除了可以借助 [K8s 的扩展机制](https://kubernetes.io/docs/concepts/extend-kubernetes/)来扩展 KubeSphere 的平台能力之外，KubeSphere 还提供了更为灵活的扩展方式。

`ks-apiserver` 是 KubeSphere 的 API 网关，提供了统一的认证、鉴权和请求代理能力，借助 `ks-apiserver` 的聚合层，可以对 KubeSphere 的 API 进行扩展：

![luban-backend-extension-architecture](./luban-backend-extension-architecture.png?width=800px)

### 认证与鉴权

KubeSphere 提供了统一的用户管理和 API 认证功能，同时还提供了多租户体系以及[基于角色的访问控制](../../feature-customization/access-control/)能力。在扩展 KubeSphere 的 API 时，可以轻松地重用这些能力。

### 请求代理

KubeSphere 的聚合层为扩展组件提供了统一的代理转发能力，通过简单的配置，即可将请求转发到集群内部、集群外部，或被纳管的 Kubernetes 集群中。详细信息请参考 [API 扩展](../../feature-customization/extending-api/)章节。
