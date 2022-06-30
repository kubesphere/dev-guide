---
title: 架构
weight: 201
description: KubeSphere 的技术架构
---

## 概述

KubeSphere 作为开源的企业级全栈化容器平台。有非常多的企业级 Kubernetes 所需的常用功能。如工作负载管理，网络策略配置，微服务治理（基于 Istio），
DevOps 工程 (CI/CD) ，安全管理，Source to Image/Binary to Image，多租户管理，多维度监控，日志查询和收集，告警通知，审计，应用程序管理和镜像
管理、应用配置密钥管理等功能模块。但是尽管 KubeSphere 有如此多的功能，也可以做到轻量化安装，你可以只安装你关心或者需要的功能，我们称之为**可插拔组件**。
一些基础功能，如工作负载管理，多租户管理，集群资源管理等，我们将其集成在命名空间 kubesphere-system 中，称为 ks-core，作为Kubesphere的核心组件，
其他均为可插拔组件，每个可插拔组件都是独立管理，可以独立安装和卸载。如果您想开启可插拔组件，请参见
[可插拔组件](https://kubesphere.io/zh/docs/v3.3/pluggable-components/overview) 。

## 架构

![architecture](/images/architecture.png)

## 插件功能

{{% notice note %}}
这篇文档主要面向开发者所以在架构图上也跟偏向于从进程的角度来剖析Kubesphere的整体结构。
{{% /notice %}}


### KS Core

- ks-apiserver 
    
    是 KubeSphere 的 API 接口注册管理中心，API 服务器。通知承载认证和鉴权等安全相关的控制。

- ks-console

    Kubesphere 的前端控制台。

- ks-controller-manager

    作为 KubeSphere 的各种控制器的管理中心，控制器用来实现业务逻辑。

- ks-installer 

    KubeSphere 的安装管理器。安装 KubeSphere 或者安装或卸载可插拔组件。

- tower

    负责多集群连接，同时负责多集群的安全控制。

- redis

    redis虽然属于核心组件，但也是一个可选服务，只有在apiserver启用高可用模式时才需要用到，用来管理用户 Token。


### Devops

### Istio

### Kube Edge

### Controls

### Logging

### Monitoring