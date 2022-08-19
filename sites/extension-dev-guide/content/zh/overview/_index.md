---
title: "概述"
weight: 1000
description: KubeSphere 4.0 扩展机制概述
---

## 为什么在 KubeSphere 4.0 引入扩展机制

KubeSphere 混合多云容器管理平台自 2018 年诞生到现在已经发布过包括 3 个大版本在内的十几个版本。为了满足用户需求，KubeSphere 集成了众多企业级功能如多租户管理，多集群管理，DevOps，GitOps，服务网格，微服务，可观测（包括监控、告警、日志、审计、事件、通知等)，应用商店，边缘计算，网络与存储管理等。

首先，如此众多的功能虽然满足了用户对容器管理平台的基本需求，但也带来了一些问题，比如：

- 版本发布周期过长。每次发布版本，得等到所有组件均开发、测试完成并进行集成测试后才能发布
- 各个组件无法单独进行迭代。KubeSphere 发布后，各组件陆续会收到社区及用户的各种反馈，但对这些反馈的处理都得等到 KubeSphere 发布新版本才能一并交付给用户，对用户的反馈不够及时
- 虽然目前已经可以做到单独启用/禁用某些组件，但是这些组件的前后端代码都是耦合在一起，容易互相影响，架构上也不够优雅
- 某些组件默认启用，对某些没有这方面需求的用户来说，占用了过多的资源

其次，云原生社区的创新非常活跃。通常同一个领域会有多种选择，比如：

- GitOps 用户可以选择 ArgoCD 或 FluxCD
- 服务网格用户可以选择 Istio 或 Linkerd 或其他实现
- 联邦集群管理可以选择 Karmada, OCM 或 Clusternet
- 日志管理可以选择 Elasticsearch 或 Loki
- 边缘计算框架可以选择 KubeEdge, OpenYurt 或 SuperEdge
- 存储和网络也有非常多的选择

KubeSphere 通常会选择一种实现优先支持，但用户经常会有支持另一种实现的需求。

此外，用户在使用 KubeSphere 的过程中，通常会面临如下问题：

- 用户发布自己的应用到 KubeSphere 后，应用的管理界面无法融入 KubeSphere 控制台。通常需要用户自己给应用的 Service 配置好 Nodeport 或者 LB 之后，才能在一个新的窗口打开应用自己的界面，无法统一地在 KubeSphere 中管理自己的应用。
- 因无法融入 KubeSphere 控制台，用户的应用也就无法利用 KubeSphere 提供的认证鉴权、多租户管理等平台级的能力，安全性上大打折扣。
- 用户的需求通常多种多样，不同用户对同一功能的需求差异很大甚至互相冲突，原有的架构因耦合式的组件集成方式无法满足用户千人千面的需求。
- 如果用户要通过给 KubeSphere 提 PR 的方式满足自己的需求，通常要熟悉完整的 KubeSphere 开发流程。因涉及到前后端开发调试、安装部署与配置等一系列问题，门槛较高。
- 此外，提了 PR 后得等 KubeSphere 发布新版本才能用
- 由于发版周期长导致大量的用户会基于 KubeSphere 定制化自己的需求，会渐进脱离社区，违背了开源社区 upstream first 的理念，长期来说，无法享受到上游越来越多的能力。

## KubeSphere 4.0 扩展机制简介

为了解决上述各种问题，KubeSphere 社区决定基于微内核架构，在 4.0 引入扩展机制：

- 扩展机制包括前端扩展机制与后端扩展机制
- KubeSphere 的核心组件精简为 ks-core，从而使得 KubeSphere 的默认安装可以非常轻量
- KubeSphere 目前已有的众多组件都会被拆分为单独的 KubeSphere 扩展组件，这些扩展组件可单独迭代，用户可以自己选择安装哪些扩展组件来打造自己的 KubeSphere 容器管理平台
- 用户可以通过相对简单的扩展组件开发指南，开发自己的扩展组件扩展 KubeSphere 的功能
- 通过 KubeSphere Extension 扩展组件管理平台统一管理各扩展组件
- 未来将引入 KubeSphere Extension Store 来丰富 KubeSphere 扩展组件生态。用户可以将自己开发的扩展组件上架 KubeSphere Extension Store 供其他用户使用甚至获利

## KubeSphere 4.0 扩展机制的优势

KubeSphere 4.0 扩展机制的优势我们可以从 KubeSphere 维护者、KubeSphere 贡献者、云原生应用开发商（ISV）或其他开源项目、KubeSphere 用户几个角度来分析。

- 对于 KubeSphere 维护者来说，KubeSphere 4.0 扩展机制使得维护者可以更聚焦 KubeSphere 核心功能的开发，并可使得 ks-core 更加轻量，版本发布节奏也可以加快。对于其他功能来说，因为采用了扩展组件来实现，可使得这些组件能够独立进行迭代，更及时的满足用户的需求
- 对于 KubeSphere·贡献者来说，因为扩展机制的引入使得 ks-core 及 KubeSphere 其他扩展组件变得更加松耦合，开发也更加易于上手
- 对于云原生应用开发商（ISV）或其他开源项目来说，KubeSphere 4.0 扩展机制使得众多 ISV 或其他开源项目可以用很小的代价就可以把产品或开源项目无缝融入到 KubeSphere 体系中来。比如 Karmada/KubeEdge 的开发人员可以基于这套扩展机制基于 KubeSphere 开发 Karmada/KubeEdge 自己的控制台
- 对于 KubeSphere 用户来说可以自由选择启用哪些 KubeSphere 扩展组件。同时还能将自己的应用无缝融入到 KubeSphere 控制台。此外，随着 KubeSphere 扩展组件生态的丰富，用户可以在 KubeSphere Extension Store 中自由选择更丰富的产品和服务，最终达到容器管理平台的千人千面的效果
