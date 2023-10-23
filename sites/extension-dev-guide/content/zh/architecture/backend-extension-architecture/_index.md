---
title: 后端扩展机制
weight: 03
description: 如何对 KubeSphere 的后端 API 进行扩展？
---

KubeSphere LuBan 构建在 K8s 之上，和 K8s 一样也具备高度可配置和可扩展的特性。除了可以借助 [K8s 的扩展机制](https://kubernetes.io/docs/concepts/extend-kubernetes/)来扩展 KubeSphere 的平台能力之外，KubeSphere 还提供了更为灵活的扩展方式，您可以创建以下几种类型的 [CR](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) 向 KubeSphere 注册 API、扩展前端 UI 或者创建动态资源代理。