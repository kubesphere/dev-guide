---
title: 扩展组件概述
weight: 01
description: 介绍 KubeSphere LuBan 的扩展机制及系统架构
---

KubeSphere 的使命是构建一个专注于云原生应用的分布式操作系统。自 3.x 版本开始，我们陆续提供了一些可插拔的系统组件。然而，由于先前的架构限制，3.x 版本的可插拔组件并不完美。

为了改进这一状况，我们对扩展组件进行了全面重新定义。

### 什么是 KubeSphere 扩展组件？

KubeSphere 扩展组件是遵循 KubeSphere 扩展组件开发规范的 Helm Chart，用于扩展 KubeSphere 的功能，并利用 Helm 进行编排。

云原生领域的开发者无需再花费大量时间学习私有的应用编排方式。

可访问 [KubeSphere Marketplace](https://kubesphere.com.cn/extensions/marketplace/) 搜索、安装已发布的扩展组件。

### KubeSphere 扩展组件有哪些功能？

KubeSphere 提供了全面的扩展 API，从前端 UI 到后端 API，几乎覆盖了每个部分，使得每个部分都可以进行个性化定制和功能增强。事实上，KubeSphere 的核心功能也是基于这些扩展 API 构建的。

使用扩展 API，可以实现以下功能：

1. **在导航栏中插入新的菜单**：可以在项目、集群、企业空间等管理页面的左侧导航栏中插入新的菜单按钮，以支持更多类型的资源管理。

2. **在模块化的功能页面中插入新的入口**：除了导航栏，KubeSphere 还提供了众多模块化的功能页面，以便轻松扩展。例如，通过卡片方式在用户首页添加新的扩展入口。

3. **通过 iframe 嵌入外部页面**：通过 iframe 技术将已有的第三方功能组件页面嵌入到 KubeSphere 中，有效地降低开发成本。

4. **覆盖 KubeSphere 已有的页面路由**：覆盖 KubeSphere 已有的页面路由，从而实现独有的业务逻辑，使 KubeSphere 更好地适应特定业务场景。

5. **对 KubeSphere 的 API 进行扩展**：扩展 KubeSphere 的后端 API，复用 KubeSphere 提供的认证和鉴权功能。

### 如何构建扩展组件？

开发扩展组件简单易上手，无需大量时间和精力。请参阅[开发流程](../../overview/development-process/)章节了解如何构建扩展组件。

### 如何寻求帮助？

如果您在开发扩展组件时遇到问题，请尝试在以下渠道获得帮助：

* [Slack Channel](https://join.slack.com/t/kubesphere/shared_invite/zt-26fio5qz5-Zqv85_vBcBvxe5SXWOwBmw)

* [GitHub Issue](https://github.com/kubesphere/kubesphere/issues/new/choose)