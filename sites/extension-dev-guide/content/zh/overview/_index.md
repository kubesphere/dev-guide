---
title: "概述"
weight: 01
description: 介绍 KubeSphere 4.0 扩展机制的背景和优势
---

## 为什么在 KubeSphere 4.0 引入扩展机制

自 2018 年 KubeSphere 混合多云容器管理平台诞生以来，已经发布了十几个版本，包括 3 个大版本。为了满足不断增长的用户需求，KubeSphere 集成了众多企业级功能，如多租户管理、多集群管理、DevOps、GitOps、服务网格、微服务、可观测性（包括监控、告警、日志、审计、事件、通知等）、应用商店、边缘计算、网络与存储管理等。

首先，尽管这些功能满足了用户在容器管理平台方面的基本需求，却引发了一些挑战，比如：
  
- 版本发布周期较长：需要等待所有组件完成开发、测试，并通过集成测试。这导致了不必要的等待时间，使用户难以及时获得新功能和修复。
- 响应不及时：KubeSphere的组件难以单独迭代，因此社区和用户提出的反馈需要等待 KubeSphere 发布新版本才能解决。这降低了对用户反馈的快速响应能力。
- 前后端代码耦合：尽管目前已能实现单独启用/禁用特定组件，但这些组件的前后端代码仍然耦合在一起，容易相互影响，架构上不够清晰和模块化。
- 组件默认启用：部分组件默认启用，这可能会占用过多的系统资源，尤其对于没有相关需求的用户。

其次，云原生领域的创新非常活跃。通常在同一个领域存在多种选择，例如：

- GitOps 用户可以选用 ArgoCD 或 FluxCD；
- 服务网格用户可以选择 Istio 或 Linkerd 或其他实现；
- 联邦集群管理可选择 Karmada、OCM 或 Clusternet；
- 日志管理可以采用 Elasticsearch 或 Loki；
- 边缘计算框架可使用 KubeEdge、OpenYurt 或 SuperEdge；
- 存储和网络领域也提供了众多选择。

KubeSphere 通常会优先支持其中一种实现，但用户常常有对其他实现的需求。

此外，在使用 KubeSphere 的过程中，用户通常会面临以下问题：

- 用户将自己的应用发布到 KubeSphere 后，应用的管理界面无法与 KubeSphere 控制台无缝集成，因而无法在 KubeSphere 内一体化管理自己的应用。通常需要用户自行配置应用的 Service，如 NodePort 或 LB，以便在新窗口中管理应用；
- 由于无法与 KubeSphere 控制台集成，用户的应用无法充分利用 KubeSphere 提供的认证鉴权、多租户管理等平台级功能，安全性受到影响；
- 用户需求多种多样，不同用户对相同功能的需求存在显著差异，有时甚至相互冲突。原有架构由于耦合式的组件集成方式，难以满足用户多样化的需求；
- 如果用户希望通过向 KubeSphere 提交 PR 来满足自己的需求，通常需要了解完整的 KubeSphere 开发流程。这包括前后端开发、调试、安装、部署和配置等一系列问题，门槛相对较高；
- 此外，提交了 PR 后，需要等待 KubeSphere 发布新版本才能使用；
- 由于发布周期较长，许多用户会自行在 KubeSphere 上定制化自己的需求，逐渐脱离社区，违背了开源社区 "upstream first" 的理念，从长远来看，将无法享受到上游越来越多的功能。

## KubeSphere 4.0 扩展机制简介

为了应对上述各种问题，KubeSphere 在 4.0 版本引入了全新的微内核架构，代号为 "LuBan"：

- 通过 LuBan，可以实现前后端功能的动态扩展。
- KubeSphere 的核心组件被精简为 ks-core，使得默认安装的 KubeSphere 变得更加轻量。
- KubeSphere 已有的众多组件都被拆分为单独的 KubeSphere 扩展组件。这些扩展组件可以单独进行迭代，用户可以自行选择安装哪些扩展组件，以打造符合其需求的 KubeSphere 容器管理平台。
- 用户可以借助相对简单的扩展组件开发指南，开发自己的扩展组件以扩展 KubeSphere 的功能。
- 通过 KubeSphere 扩展中心，统一管理各扩展组件。
- 为了丰富 KubeSphere 扩展组件的生态系统，我们还提供了 KubeSphere Marketplace 扩展市场。用户可以将自己开发的扩展组件上架至 KubeSphere 扩展市场，供其他用户使用甚至赚取收益。

## KubeSphere LuBan 架构的优势

KubeSphere LuBan 架构的优势可以从多个角度分析，包括 KubeSphere 维护者、KubeSphere 贡献者、云原生应用开发商（ISV）和其他开源项目、以及 KubeSphere 用户：

- 对于 KubeSphere 维护者：LuBan 架构引入的扩展机制使维护者能够更专注于开发 KubeSphere 核心功能，使 ks-core 变得更轻量化，同时可以提高版本发布速度。对于其他功能，由于采用扩展组件实现，这些组件可以独立迭代，更及时地满足用户需求。

- 对于 KubeSphere 贡献者：扩展机制的引入使 ks-core 和其他 KubeSphere 扩展组件之间更松耦合，开发也更加容易上手。

- 对于云原生应用开发商（ISV）和其他开源项目：KubeSphere LuBan 架构的扩展机制允许 ISV 和其他开源项目以较低的成本将其产品或项目顺利集成到 KubeSphere 生态系统中。例如，Karmada 和 KubeEdge 的开发者可以基于这一扩展机制开发适用于 KubeSphere 的自定义控制台。

- 对于 KubeSphere 用户：用户可以自由选择启用哪些 KubeSphere 扩展组件，还能将自己的组件顺利集成到 KubeSphere 控制台中。随着 KubeSphere 扩展组件生态的不断丰富，用户可以在 KubeSphere 扩展市场中选择更多丰富的产品和服务，实现容器管理平台的高度个性化。