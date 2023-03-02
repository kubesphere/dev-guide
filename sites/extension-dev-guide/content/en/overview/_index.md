---
title: "Overview"
weight: 1
description: Describes why KubeSphere LuBan 4.0 adopts an extension machanism and how developers can benefit from it.
---

## Why KubeSphere LuBan 4.0 adopts an extension mechanism

Since 2018, KubeSphere, a container management platform for hybrid clouds, has been iterated with three major versions and a dozen of minor versions. To meet different business requirements, KubeSphere enables diverse enterprise-grade features, from multi-tenancy, multi-cluster management, DevOps, GitOps, service mesh, microservices, observability, app store, edge computing, to networking and storage.

The diversity of product features meets business requirements of different users for container management, but some issues can also occur:

- The release life cycle of KubeSphere is long. A new version can be rolled out only after all components are developed and tested.
- Each component cannot be iterated independently. Each time a new version of KubeSphere is released, we can receive feedback from community members. The only time we can respond to and resolve these issues is the time when the next version gets released. This causes slow customer response.
- Although you can enable or disable some components individually, the front-end code and backend code of these components are coupled. These components are prone to be affected by each other, and the architecture is not graceful.
- If you do not need to use a feature that is enabled by default, this may cause excessive resource consumption.

Innovation in cloud native communities is active.Therefore, several solutions can be available for a specific scenario. For example:

- Use ArgoCD or FluxCD for GitOps.
- Use Istio or Linkerd for service meshes.
- Use Karmada, OpenShift Cluster Manager (OCM), or Clusternet for cluster federation.
- Use Elasticsearch or Loki for log management.
- Use KubeEdge, OpenYurt, or SuperEdge for edge computing.
- Use different solutions for storage and networking.

In a specific scenario, KubeSphere tends to select a solution for implementation. However, you may require the implementation of another solution.

When you use KubeSphere, you may encounter the following issues:

- After your application gets released on KubeSphere, the application management page cannot be integrated into the KubeSphere console. In this case, you need to configure a NodePort or LoadBalancer service for your application and open the application management page in a new window. This indicates that you cannot manage your application in a centralized manner.
- If the application management page cannot be integrated into the KubeSphere console, platform-level security features provided by KubeSphere such as authorization and authentication and multi-tenancy will not be available for your application.
- User requirements are diverse, and the requirements for the same feature may also be different or even conflicting. The legacy architecture cannot meet the requirements of thousands of users because each component is tightly coupled with each other.
- If you want to create pull requests to meet specific requirements, you must be familiar with the development workflows of KubeSphere. This involves frontend and backend testing and debugging, installation, deployment, and configuration, which puts high requirements on users' technical expertise.
- The changes you have made in pull requests can be applied only after a next version gets released.
- Due to the long release cycle, a large number of users will customize their own needs on top of KubeSphere and then gradually leave the community. This goes against the Upstream First policy. In the long run, users cannot enjoy the capabilities of the upstream community.

## Overview

To resolve the preceding issues, the KubeSphere community introduces an extension mechanism in 4.0 by adopting a microkernel architecture.

- The extension mechanism includes frontend and backend extensions.
- The critical components of KubeSphere are encapsulated into ks-core. This way, you can install KubeSphere in lightweight mode.
- Various existing components of KubeSphere will be decoupled into separate extensions, and each extension can be iterated independently. You can choose which extensions to install and customize the KubeSphere console.
- You can develop extensions to extend the functionality of KubeSphere based on the extension development guide.
- You can manage extensions in the unified KubeSphere extension management platform.
- The KubeSphere extension center will be introduced to enrich the KubeSphere extension ecosystem. You can roll out self-developed extensions on the KubeSphere extension center for other users to use and even make profits.

## Benefits

The extension mechanism of KubeSphere LuBan 4.0 can benefit KubeSphere maintainers, contributors, users, independent software vendors (ISVs), and other open source projects.

- 对于 KubeSphere 维护者来说，KubeSphere LuBan 4.0 扩展机制使得维护者可以更聚焦 KubeSphere 核心功能的开发，并可使得 ks-core 更加轻量，版本发布节奏也可以加快。对于其他功能来说，因为采用了扩展组件来实现，可使得这些组件能够独立进行迭代，更及时的满足用户的需求
- 对于 KubeSphere·贡献者来说，因为扩展机制的引入使得 ks-core 及 KubeSphere 其他扩展组件变得更加松耦合，开发也更加易于上手
- 对于云原生应用开发商（ISV）或其他开源项目来说，KubeSphere LuBan 4.0 扩展机制使得众多 ISV 或其他开源项目可以用很小的代价就可以把产品或开源项目无缝融入到 KubeSphere 体系中来。比如 Karmada/KubeEdge 的开发人员可以基于这套扩展机制基于 KubeSphere 开发 Karmada/KubeEdge 自己的控制台
- 对于 KubeSphere 用户来说可以自由选择启用哪些 KubeSphere 扩展组件。同时还能将自己的应用无缝融入到 KubeSphere 控制台。此外，随着 KubeSphere 扩展组件生态的丰富，用户可以在 KubeSphere Extension Store 中自由选择更丰富的产品和服务，最终达到容器管理平台的千人千面的效果