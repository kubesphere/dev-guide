---
title: 平台功能&QA
weight: 07
description: "平台功能&QA"
---

## 监控对接

待补充

## 告警对接

待补充

## license对接

待补充

## KubeSphere API

KubeSphere API 是 K8s API 的超集，沿用了 K8s API 的设计，通过 HTTP 提供了基于资源 (RESTful) 的编程接口。它支持通过标准 HTTP 动词（POST、PUT、PATCH、DELETE、GET）来检索、创建、更新和删除主要资源。

在使用 KubeSphere API 之前，**您需要先阅读并理解** [K8s API 的概念](https://kubernetes.io/zh-cn/docs/reference/using-api/api-concepts/)。

KubeSphere 提供了 K8s API 代理，通过 `/apis`、`/api` 前缀可以直接访问 K8s 的 API。此外，KubeSphere 在 K8s 的基础上支持额外的资源层级，包括平台级资源（例如用户、集群、企业空间等），以及企业空间级资源。KubeSphere 扩展的 API 通常以 `/kapis` 为前缀。

例如:

* `/api/v1/namespaces`
* `/api/v1/pods`
* `/api/v1/namespaces/my-namespace/pods`
* `/apis/apps/v1/deployments`
* `/apis/apps/v1/namespaces/my-namespace/deployments`
* `/apis/apps/v1/namespaces/my-namespace/deployments/my-deployment`
* `/kapis/iam.kubesphere.io/v1beta1/users`
* `/kapis/tenant.kubesphere.io/v1alpha2/workspaces/my-workspace/namespaces`

**多集群**

KubeSphere 支持 K8s 多集群纳管。只要在请求路径之前添加集群标识作为前缀，就可以通过 API 直接访问 member 集群。

例如:

* `/clusters/host/api/v1/namespaces`
* `/clusters/member/api/v1/namespaces`

详细api您可以访问 [kubesphere api ](https://docs.kubesphere.com.cn/reference/api/v4.0.0/introduction/)获取

## Q&A

**Q:** 扩展安装的时候需要特定的存储如SSD

**A:** 扩展是一个helm包, 所以可以自行设置存储类型变量, 让用户安装的时候手动修改

**Q:** 我的扩展还有自己的界面, 如自带一个监控面板, 如何暴露

**A:** 使用标准的k8s svc暴露方式自行操作, 暂无ui入口

**Q:** 如何使用工单系统, 信息推送系统

**A:** ks实现了多种IM/邮件等平台对接, 调用 [kubesphere api ](https://docs.kubesphere.com.cn/reference/api/v4.0.0/introduction/) 即可

**Q:** 是否有对扩展的运行状态有遥测api

**A:** 暂时没有