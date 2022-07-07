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
这篇文档主要面向开发者，所以在架构图上更偏向于从进程的角度来剖析 Kubesphere 的整体结构。
{{% /notice %}}


### KS Core

| 模块 | 类型 |描述 |
| --- | ---| --- |
| ks-apiserver          | Deployment |  是 KubeSphere 的 API 接口注册管理中心，API 服务器。同事承载认证和鉴权等安全相关的控制。 |
| ks-console            | Deployment |Kubesphere 的前端控制台。                                                     |
| ks-controller-manager | Deployment | 作为 KubeSphere 的各种控制器的管理中心，控制器用来实现业务逻辑。                     |

<!--
  补充 OpenPitrix
-->

### DevOps

| 模块 | 类型 | 描述 |
| --- | --- | --- |
| devops-jenkins    | Deployment | 包含原生 Jenkins 以及常用的一些插件。 |
| devops-apiserver  | Deployment | 提供 DevOps Web UI 访问的 Restful API。 |
| devops-controller | Deployment | 包含 DevOps 集成组件（例如：Jenkins、Argo CD 等）的交互。 |
| s2ioperator       | StatefulSet | 将源代码自动将编译并打包成 Docker 镜像，方便快速构建镜像。 |

### Istio

| 模块 | 类型 | 描述 |
| --- | --- | --- |
| kiali                | Deployment | Istio 服务网格的可视化工具。 |
| kiali-operator       | Deployment | kiali 的控制器。 |
| jaeger-operator      | Deployment | jaeger 的控制器。  |
| jaeger-query         | Deployment | 接收查询请求，然后从后端存储系统中检索 Trace 并通过 Web UI 展示。 |
| jaeger-controller    | Deployment | 收集 Sidecar 的数据。Istio 中的 Sidecar 为 jaeger-agent。 |
| istio-ingressgateway | Deployment | 为微服务提供外网访问的网关。 |
| istiod-1-11-2        | Deployment | 原生 Istio，提供微服务相关功能。|

### Kube Edge

| 模块 | 类型 | 描述 |
| --- | --- | --- |
| edge-watch-controller-manager| Deployment | 监控边缘节点。 |
| cloudcore                    | Deployment | KubeEdge 在云端的核心组件。|
| iptables                     | DaemonSet  | 管理边缘节点网络规则。 |

### Controls

| 模块 | 类型 | 描述 |
| --- | --- | --- |
| default-http-backend | Deployment | KubeSphere 网关管理 |
| kubectl-admin        | Deployment | Kubectl 控制台，提供在 KubeSphere 前端界面的工具箱中使用 kubectl。 |

### Logging

| 模块 | 类型 | 描述 |
| --- | --- | --- |
| ks-event-export                 | Deployment | Kubernetes 事件收集。|
| ks-event-ruler                  | Deployment | 事件规则引擎服务，提供事件过滤和告警功能。 |
| ks-event-operator               | Deployment | kube-event 控制器。 |
| kube-auditing-operator          | Deployment | kube-auditing-webhook-deploy 的控制器。 |
| logsidecar-injector-deploy      | Deployment | 为指定容器组自动注入用于落盘日志收集的 Sidecar 容器 |
| fluentbit-operator              | Deployment | fluentbit 控制器。 |
| kube-auditing-webhook-deploy    | Deployment | 事件规则引擎服务，提供事件审计过滤和告警功能。|
| elasticsearch-logging-discovery | StatefulSet | 提供 Elasticsearch 集群管理服务。 |
| elasticsearch-logging-data      | StatefulSet | 提供 Elasticsearch 数据存储、备份、搜索等服务，在安装时也可对接您已有的 ES 减少资源消耗。|
| fluentbit                       | DaemonSet | 提供日志采集与转发，可将采集到的⽇志信息发送到 ElasticSearch、Kafka。 |

### Monitoring

| 模块 | 类型 | 描述 |
| --- | --- | --- |
| notification-manager-deployment | Deployment | 提供发送邮件、微信消息、Slack 消息等通知的服务。|
| prometheus-operator             | Deployment | prometheus 控制器。 |
| kube-state-metrics              | Deployment | 监听 Kubernetes API 服务器以获取集群中的节点、工作负载、容器组等 API 对象的状态，并生成相关监控数据供 Prometheus 抓取。|
| notification-manager-operator   | Deployment | notification-manager 的控制器。 |
| prometheus-k8s                  | StatefulSet | 收集和存储包括节点、工作负载、 API 对象的相关监控数据。|
| thanos-ruler-kubesphere         | StatefulSet | 提供自定义告警规则服务。 |
| alertmananger-main              | StatefulSet | Alertmanager 告警管理工具，也提供Web UI 服务。 |
| node-exporter                   | DaemonSet | 从集群各个节点收集监控数据，供 Prometheus 抓取。 |