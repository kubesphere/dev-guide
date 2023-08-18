---
title: "Overview"
weight: 01
description: What is the KubeSphere Extension and what can it do? 
---

KubeSphere is dedicated to building a distributed operating system for cloud-native applications. Since version 3.x, a number of pluggable system components has been provided, but due to architectural constraints, the pluggable components in version 3.x were not perfect.

So we have redefined the extensions.

### What is a KubeSphere Extension?

A KubeSphere Extension is a Helm Chart to extend the functionality of KubeSphere and orchestrate it with Helm, which follows the KubeSphere extension development specification.

So cloud-native developers don't have to spend a lot of time learning proprietary application orchestration methods any longer.

To get published extensions, go to [KubeSphere Marketplace](https://kubesphere.com.cn/extensions/marketplace/).

### What can KubeSphere extensions do?

Almost every part of KubeSphere, from the frontend UI to the backend API, can be customized and enhanced using the extension API. Many key features of KubeSphere are also built as extensions and use the same extension API.

The following are some examples that you can achieve with the extension API:

1. Inject new menus and pages into the side navigation bar of a project to support managing more types of resources.
2. Inject functional entries into the platform's hierarchical menus to enhance the platform's management capabilities. 
3. Embed existing third-party extension pages directly into KubeSphere to aggregate decentralized systems. 
4. Override KubeSphere's existing page routing to realize your unique business logic.
5. Extend the KubeSphere API.

To know more about extension APIs, please refer to [Custom Features](../../feature-customization/).


### How to develop an extension?

Building an extension may take a lot of time and effort, see the [Procedure](../../development-procedure/) section to get familiar with the process.


### Getting Help

* [Slack Channel](https://join.slack.com/t/kubesphere/shared_invite/zt-219hq0b5y-el~FMRrJxGM1Egf5vX6QiA)

* [GitHub Issue](https://github.com/kubesphere/kubesphere/issues/new/choose)