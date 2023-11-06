---
title: Backend Extension Mechanism
weight: 03
description: Describes how to extend the backend API of KubeSphere.
---

Built on K8s, KubeSphere is highly configurable and extensible like K8s. In addition to extending KubeSphere capabilities with the help of the [K8s extension mechanism](https://kubernetes.io/docs/concepts/extend-kubernetes/), KubeSphere offers a more flexible way to extend its capabilities.

`ks-apiserver` is the API gateway for KubeSphere, offering unified authentication, authorization, and request proxy capabilities. By using the aggregation layer of ks-apiserver, you can extend KubeSphere API as follows:

![api-proxy](./api-proxy.png)

### Authentication and Authentication

KubeSphere supports unified user management and API authentication, as well as a multi-tenant system and [role-based access control](../../feature-customization/access-control/). These capabilities can be easily reused when extending KubeSphere API.

### Request Proxy

KubeSphere's aggregation layer supports unified proxy forwarding for extensions, which can be simply configured to forward requests into a cluster, outside a cluster, or a managed Kubernetes cluster. View the [API Extensions](../../feature-customization/extending-api/) section for more information.