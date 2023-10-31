---
title: 扩展组件概述
weight: 01
description: 介绍 KubeSphere LuBan 的扩展机制及系统架构
---

KubeSphere 致力于构建一个面向云原生应用的分布式操作系统。自 3.x 版本起，我们陆续提供了一些可插拔的系统组件。然而，由于之前的架构限制，3.x 版本的可插拔组件并不完美。

为了改进这一状况，我们对扩展组件进行了全面重新定义。

### 什么是 KubeSphere 扩展组件？

KubeSphere 扩展组件是一个可以对 KubeSphere 功能进行扩展并借助 Helm 进行编排的遵循 KubeSphere 扩展组件开发规范的 Helm Chart。

作为云原生领域的开发者，您不必再花大量的时间去学习一个私有的应用编排方式。

如果您正在寻找已发布的扩展，请前往 [KubeSphere Marketplace](https://kubesphere.com.cn/extensions/marketplace/)。

### KubeSphere 扩展组件可以做什么？

KubeSphere 提供了全面的扩展 API，涵盖了从前端 UI 到后端 API 的几乎每个部分，使得每个部分都可以进行定制和增强。许多 KubeSphere 的核心功能也都是基于这些扩展 API 构建的。

使用扩展 API，可以实现以下功能：

1. **在导航栏中插入新的菜单：** 在项目、集群、企业空间等管理页面中的左侧导航栏插入新的菜单按钮，从而支持更多类型的资源管理。

2. **在模块化的功能页面插入新的入口：** 除了导航栏，KubeSphere 还提供了许多模块化的功能页面以便扩展，比如用户首页可以通过卡片的方式添加新的扩展。

3. **通过 iframe 嵌入页面：** 可以将已有的第三方功能组件页面通过 iframe 嵌入到 KubeSphere，可以有效的降低开发成本。

4. **覆盖 KubeSphere 已有的页面路由：** 可以覆盖 KubeSphere 已有的页面路由重写，实现独有的业务逻辑，使得 KubeSphere 可以更好地适应您的业务场景。

5. **对 KubeSphere 的 API 进行扩展：** 可以对 KubeSphere 的后端 API 进行扩展，复用 KubeSphere 提供的认证、鉴权能力。

### 如何构建扩展组件？

构建一个扩展并不需要花费太多时间和精力，请参阅[开发流程](../../development-procedure/)章节来熟悉这个过程。

### 寻求帮助

如果您对扩展开发有疑问，请尝试在以下渠道获得帮助：

* [Slack Channel](https://join.slack.com/t/kubesphere/shared_invite/zt-219hq0b5y-el~FMRrJxGM1Egf5vX6QiA)

* [GitHub Issue](https://github.com/kubesphere/kubesphere/issues/new/choose)