---
title: "Overview"
weight: 1
description: Describes why KubeSphere LuBan 4.0 adopts an extension machanism and how developers can benefit from it.
---

## Why KubeSphere 4.0 adopts an extension mechanism

Since 2018, KubeSphere, a container management platform for hybrid clouds, has been iterated with three major versions and a dozen of minor versions. To meet different business requirements, KubeSphere enables diverse enterprise-grade features, from multi-tenancy, multi-cluster management, DevOps, GitOps, service meshes, microservices, observability, app store, edge computing, to networking and storage.

The following challenges are still faced by KubeSphere:

- The release cycle is long. Before a new version gets released, you need to to wait for all components to complete development and pass the integration test.
- After KubeSphere is released, we can gradually gather feedback from the community and users on each component. However, each component cannot be iterated independently. To cope with the feedback, we need to iterate a new version of KubeSphere. This makes the response slow.
- Although you can enable or disable some components separately, the frontend code and backend code of these components are coupled. These components are prone to be affected by each other, and the architecture is not graceful.
- 部分组件默认启用，对于没有相关需求的用户来说，可能会占用过多的系统资源。

Innovation in cloud native communities is active. Therefore, several solutions can be available for a specific scenario. For example:

- Use ArgoCD or FluxCD for GitOps.
- Use Istio or Linkerd for service meshes.
- Use Karmada, OpenShift Cluster Manager (OCM), or Clusternet for cluster federation.
- Use Elasticsearch or Loki for log management.
- Use KubeEdge, OpenYurt, or SuperEdge for edge computing.
- 存储和网络也有非常多的选择。

For business requirements in a specific scenario, KubeSphere tends to select a solution for implementation. However, you may require the implementation of another solution.

When you use KubeSphere, you may encounter the following issues:

- After your application gets released on KubeSphere, the application management page cannot be integrated into the KubeSphere console. In this case, you need to configure a NodePort or LoadBalancer service for your application and open the application management page in a new window. This indicates that you cannot manage your application in a centralized manner.
- If the application management page cannot be integrated into the KubeSphere console, platform-level security features provided by KubeSphere such as authorization and authentication and multi-tenancy will not be available for your application.
- User requirements are diverse, and the requirements for the same feature may also be different or even conflicting. The legacy architecture cannot meet the requirements of thousands of users because each component is tightly coupled with each other.
- If you want to create pull requests to meet specific requirements, you must be familiar with the development workflows of KubeSphere. This involves frontend and backend testing and debugging, installation, deployment, and configuration, which puts high requirements on users' technical expertise.
- The changes you have made in pull requests can be applied only after a next version gets released.
- Due to the long release cycle, a large number of users will customize their own needs on top of KubeSphere and then gradually leave the community. This goes against the Upstream First policy. In the long run, users cannot enjoy the capabilities of the upstream community.

## Overview

To resolve the preceding issues, KubeSphere 4.0 introduces a next-generation micro-kernel architecture named LuBan:

- KubeSphere LuBan extends the functionality of frontend and backend extensions.
- The critical components of KubeSphere are encapsulated into ks-core. This way, you can install KubeSphere in lightweight mode.
- Various existing components of KubeSphere will be decoupled into separate extensions, and each extension can be iterated independently. You can choose which extensions to install and customize the KubeSphere console.
- You can develop extensions to extend the functionality of KubeSphere based on this guide.
- You can manage extensions in the unified KubeSphere extension management platform.
- 未来将引入 KubeSphere 扩展市场来丰富 KubeSphere 扩展组件生态。用户可以将自己开发的扩展组件上架 KubeSphere 扩展市场供其他用户使用甚至获利。

## Benefits

The extension mechanism of KubeSphere LuBan  can benefit KubeSphere maintainers, contributors, users, independent software vendors (ISVs), and other open source projects.

- For KubeSphere maintainers, the extension mechanism allows you to focus more on the development of KubeSphere critical features, and can make ks-core more lightweight. This accelerates the release cycles. For other features, the extension mechanism allows you to develop components independently to meet your business needs in a more timely manner.
- For KubeSphere contributors, the extension mechanism makes ks-core and other KubeSphere components loosely coupled, so that you can get started with development at ease.
- For ISVs, the extension mechanism allows you to integrate services or other open source projects into KubeSphere at a low cost. For example, Karmada or KubeEdge developers can customize the KubeSphere console based on this extension mechanism.
- For KubeSphere users, you can determine whether to enable an extension based on your business requirements. You can also integrate your application into the KubeSphere console.此外，随着 KubeSphere 扩展组件生态的丰富，用户可以在 KubeSphere 扩展市场中自由选择更丰富的产品和服务，最终达到容器管理平台的千人千面的效果。