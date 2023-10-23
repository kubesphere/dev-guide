---
title: "概述"
weight: 01
description: 什么是 KubeSphere 扩展组件，它可以做什么？ 
---

KubeSphere 致力于构建一个面向云原生应用的分布式操作系统。自 3.x 版本起，我们陆续提供了一些可插拔的系统组件。然而，由于之前的架构限制，3.x 版本的可插拔组件并不完美。

为了改进这一状况，我们对扩展组件进行了全面重新定义。

### 什么是 KubeSphere 扩展组件？

KubeSphere 扩展组件是一个可以对 KubeSphere 功能进行扩展并借助 Helm 进行编排的遵循 KubeSphere 扩展组件开发规范的 Helm Chart。

作为云原生领域的开发者，您不必再花大量的时间去学习一个私有的应用编排方式。

如果您正在寻找已发布的扩展，请前往 [KubeSphere Marketplace](https://kubesphere.com.cn/extensions/marketplace/)。

### KubeSphere 扩展组件可以做什么？

KubeSphere 提供了全面的扩展 API，涵盖了从前端 UI 到后端 API 的几乎每个部分，使得每个部分都可以进行定制和增强。许多 KubeSphere 的核心功能也都是基于这些扩展 API 构建的。

使用扩展 API，您可以实现以下功能：

1. **在项目的侧边导航栏中注入新的菜单和功能页面：** 通过扩展 API，您可以轻松地向项目的侧边导航栏中注入新的菜单项和功能页面，从而支持管理更多类型的资源，提供更丰富的功能体验。

2. **在平台层级菜单中注入功能入口：** 扩展 API 允许您在平台层级菜单中注入自定义的功能入口，从而增强对整个平台的管理能力，使得管理操作更加灵活和便捷。

3. **直接嵌入第三方功能组件页面到 KubeSphere：** 借助扩展 API，您可以将已有的第三方功能组件页面嵌入到 KubeSphere 中，实现对各分散的系统进行聚合，提供统一的界面和操作入口，提高用户的使用便捷性。

4. **覆盖 KubeSphere 已有的页面路由：** 扩展 API 允许您覆盖 KubeSphere 已有的页面路由，实现您独有的业务逻辑。这意味着您可以根据项目需求自定义页面的跳转和数据处理逻辑，使得 KubeSphere 更好地适应您的业务场景。

5. **对 KubeSphere 的 API 进行扩展：** 扩展 API 还允许您对 KubeSphere 的后端 API 进行扩展。您可以添加自定义的 API 端点，实现额外的功能或者数据操作，使得 KubeSphere 的功能范围得以扩展，满足更多定制化需求。

### 如何构建扩展组件？

构建一个扩展并不需要花费太多时间和精力，请参阅[开发流程](../../development-procedure/)章节来熟悉这个过程。

### 寻求帮助

如果您对扩展开发有疑问，请尝试在以下渠道获得帮助：

* [Slack Channel](https://join.slack.com/t/kubesphere/shared_invite/zt-219hq0b5y-el~FMRrJxGM1Egf5vX6QiA)

* [GitHub Issue](https://github.com/kubesphere/kubesphere/issues/new/choose)
