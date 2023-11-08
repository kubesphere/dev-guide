---
title: "Overview"
weight: 01
description: What is the KubeSphere Extension and what can it do? 
---

KubeSphere is dedicated to building a distributed operating system for cloud-native applications. Since version 3.x, numerous pluggable system components have been provided, but due to architectural constraints, the pluggable components in version 3.x were not perfect.

So we have redefined the extensions.

### What is a KubeSphere extension?

A KubeSphere extension is a Helm Chart to extend the functionality of KubeSphere and orchestrate it with Helm, which follows the KubeSphere extension development guide.

So cloud-native developers don't have to spend a lot of time learning proprietary application orchestration methods any longer.

To get published extensions, go to [KubeSphere Marketplace](https://kubesphere.com.cn/extensions/marketplace/).

### What can KubeSphere extensions do?

Almost every part of KubeSphere, from the frontend UI to the backend API, can be customized and enhanced using the extension API. Many key features of KubeSphere are also built as extensions and use the same extension API.

The following are some examples that you can achieve with the extension API:

1. **Insert new menu into the navigation pane**: Insert new menus into the left navigation pane of pages for project management, cluster management, and workspace management to support the management of different types of resources.

2. **Insert new entry in modular functional pages**: In addition to the navigation pane, KubeSphere also provides numerous modular functional pages. For example, you can add new entries for extensions to the user homepage in a card-like manner.

3. **Embed external pages through iframe**:  Use iframe technology to embed existing third-party functional pages into KubeSphere to effectively reduce development costs.

4. **Override existing KubeSphere page routes**: Override KubeSphere's existing page routes to implement unique business logic and make KubeSphere better adapt to specific business scenarios.

5. **Extend KubeSphere's APIs**: Extend KubeSphere's backend APIs, reusing the authentication and authorization features provided by KubeSphere.


### How to develop an extension?

Developing extensions is simple and easy to get started. View the [Procedure](../../development-procedure/) section to get familiar with the process.


### Get help

* [Slack Channel](https://join.slack.com/t/kubesphere/shared_invite/zt-26fio5qz5-Zqv85_vBcBvxe5SXWOwBmw)

* [GitHub Issue](https://github.com/kubesphere/kubesphere/issues/new/choose)