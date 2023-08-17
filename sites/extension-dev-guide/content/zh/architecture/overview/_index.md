---
title: "概述"
weight: 01
description: 什么是 KubeSphere 扩展组件，它可以做什么？ 
---

KubeSphere 致力于构建一个面向云原生应用的分布式操作系统，从 3.x 版本以来我们陆陆续续提供了一些可插拔的系统组件，但由于既往架构层面的限制，3.x 版本的可插拔组件显得不是那么的完美。

这一次，我们重新对扩展组件进行了定义。

### 什么是 KubeSphere 扩展组件？

KubeSphere 扩展组件是一个可以对 KubeSphere 功能进行扩展并借助 Helm 进行编排的遵循 KubeSphere 扩展组件开发规范的 Helm Chart。

作为云原生领域的开发者，您不必再花大量的时间去学习一个私有的应用编排方式。

如果您正在寻找已发布的扩展，请前往 [KubeSphere Marketplace](https://kubesphere.com.cn/extensions/marketplace/)。

### KubeSphere 扩展组件可以做什么？

从前端 UI 到后端 API，KubeSphere 的几乎每个部分都可以通过扩展 API 进行定制和增强。KubeSphere 的许多核心功能也都是作为扩展构建的，并使用相同的扩展 API。

以下是使用扩展 API 可以实现的一些示例：

1. 在项目的侧边导航栏，注入新的菜单与功能页面，支持管理更多类型的资源。
2. 在平台层级菜单中注入功能入口，对平台的管理能力进行增强。
3. 直接嵌入已有的第三方功能组件页面到 KubeSphere，对各分散的系统进行聚合。
4. 覆盖 KubeSphere 已有的页面路由，实现您独有的业务逻辑。
5. 对 KubeSphere 的 API 进行扩展。

如果您想更全面地了解扩展 API，请参阅[功能定制](../../feature-customization/)章节。

### 如何构建扩展组件？

构建一个好的扩展可能需要花费大量的时间和精力，请参阅[开发流程](../../development-procedure/)章节来熟悉这个过程。


### 寻求帮助

如果您对扩展开发有疑问，请尝试在以下渠道获得帮助：

* [Slack Channel](https://join.slack.com/t/kubesphere/shared_invite/zt-219hq0b5y-el~FMRrJxGM1Egf5vX6QiA)

* [GitHub Issue](https://github.com/kubesphere/kubesphere/issues/new/choose)
