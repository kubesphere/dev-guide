---
title: "Databend Playground 开发小记"
weight: 01
description: "介绍 Databend Playground 的开发经验和总结"
---

12 月 5 日，Databend Labs 旗下 Databend Playground（社区尝鲜版）成功上架青云科技旗下 KubeSphere Marketplace 云原生应用扩展市场，为用户提供一个快速学习和验证 Databend 解决方案的实验环境。

![Databend1](Databend1.jpeg?width=1200px)

今天这篇文章主要从设计决策、实现选型、问题与解决方案等方面回顾一下 Databend Playground 在开发过程中的一些经验和总结。

## 设计决策

Databend 是使用 Rust 研发、完全⾯向云架构、基于对象存储构建的新一代云原生数据仓库。主要包含 Meta 和 Query 两个服务，在生产环境，往往需要以集群形式部署，其架构如下所示：

![Databend2](Databend2.png?width=1200px)

KubeSphere 扩展组件可以利用 K8s 的资源管理和调度能力，提供可视化的操作界面，方便用户管理和监控相关资源。

一个很自然的想法就是使用扩展组件能力简化部署，但是简化部署是不够的，Databend 此前有上架 KubeSphere 应用商店，本身也提供 helm charts 方便 K8s 用户使用，如果预先对相关机制有了解，部署使用 Databend 并不难。

进一步的想法主要是两个方面：

- 一是用户可能不了解 Databend ，或者只是想验证部分能力，是不是可以提供一个默认的 All in One 的选项。就像 Docker 命令一次性拉起环境。
- 二是用户可能更需要简化的连接和使用方式，继续折腾客户端、解决远程连接等问题是不现实的，最好是像 Databend Cloud 一样有一套 SQL IDE ，提供关于表和查询结果相关信息。

所以 Databend Playground 从最开始就希望成为一个面向刚接触 Databend 的新人的一站式简易环境搭建和 SQL IDE 支持方案。

## 实现选型

Databend Playground 扩展组件使用前端 iframe 嵌入扩展的形式，可以有效复用原有的 Web 服务和资源，大幅减轻了研发负担。

在学习并验证 KubeSphere 中扩展组件的开发方式和几个示例之后，就需要确定实现的方案了。官方支持前端扩展、后端扩展等多种形式，对于 Databend Playground 这个案例，由于目标是解决部署问题并且提供 SQL IDE ，主要需要采用的是前端扩展的形式。

比较明确的需求是，在安装之后有一个对应的前端入口点，并且有一个前端 IDE 。从头开发需要的周期比较长，直接迁移 Databend Cloud 的方案又比较困难，最后将目光锁定在了早期为了方便用户体验而实现的 Databend Playground 这个项目上（这个扩展组件最后也继承了这个名字）。

![Databend3](Databend3.jpeg?width=1200px)

最初的 Databend Playground 是一个服务端程序，它会代理 Databend 的 HTTP Handler ，供前端进行查询和展示。这个模式非常适合使用 KubeSphere 的 iframe 嵌入模式，尽管由于代码过时需要进行一定程度的更新维护，但避免了复杂的前端开发需要。

前端的问题解决了，接下来就是后端部署，后端部署涉及的组件非常清晰，在第一期的规划中仅仅考虑单 Meta 、单 Query 和单 Playground 实例，由于有存储后端需要，再附加一个 MinIO 实例。其实 KubeSphere 扩展组件相当于是一个伞形的 Helm Charts 以及一些描述文件，所以在不涉及后端拓展功能开发的情况下，可以复用 Helm 的部署方案，如果本身熟悉 K8s/KubeSphere 生态就会比较轻松。

## 当前状态与后续规划

借助 KubeSphere 的扩展系统，Databend Playground（社区尝鲜版）可以帮助用户快速部署和启动数据分析环境，并且集成前端 SQL IDE，使用户能够轻松进行数据分析而无需担心规模化部署的复杂性。该扩展组件的主要目标用户是 Databend 新手或初学者，适用于学习 Databend 的 SQL 语法和体验数据分析方案。

目前，Databend Playground 仅支持单 Query 、单 Meta 、单 Playground 一键部署的模式。我们计划在此基础上继续迭代产品，未来将允许用户自定义存储后端、引入高可用 Meta 架构和计算资源的弹性扩展机制。此外，还将提供监控大盘和其他附加服务，以增强用户体验和系统的可管理性。

## 问题解决

略过具体的开发不提，这里讲讲实际过程中遇到的一些问题和解决方案。

1. 远程集群和本地开发机的连接问题。
   
    KubeSphere 开发文档中没有提示相关的情况，可能是考虑到用户本地环境可以部署开发集群，但是在部分发行版上可能不适用，需要将远程机器的 IP 添加到 K8s API Server 中，步骤可以参考这篇文章 [How to add a new hostname or IP address to a Standalone Kubernetes API server](https://kloudle.com/academy/how-to-add-new-hostname-ipaddress-to-kubernetes-api-server/)

2. 开发时，前端嵌入时提示没有权限访问资源。

    需要配置 Webpack 的 DevServer ，在代理请求时传递 username、password 等鉴权信息。在和 KubeSphere 的维护者沟通以后得到解决方案，目前文档也已经更新。

3. 前端代理后无法正常显示页面。

    首先需要检查路径的相对关系，保证你的前端入口和代理路径是一致的，也就是说，如果代理地址是/proxy/databend.playground 那么原本的 baseUrl 也需要进行调整。其次如果调试模式无法正常工作，可能需要在 index.js 下增加一行 export {} 以确保其不会被识别为 commonJS 。如果生产模式仍然故障的话，需要检查前端编译的产物，必要时和 KubeSphere 团队取得联系。

## 对于 KubeSphere 扩展组件开发者的建议

目前 KubeSphere 扩展组件市场正在积极建设之中，如果你有一个好的 Idea 不妨做着试试看。

这里也附带一个适合新手的快速后端部署 Demo 办法，希望能够帮到大家：

- 使用 Docker 和 Docker Compose 组织并调试部署方案。
- 利用 kompose convert 将 docker-compose.yaml 转换成 Helm Charts 。
根据实际情况调试和调整。
- 如果有什么困难也可以和 KubeSphere 工程师团队的小伙伴们积极沟通，可以快速定位和解决问题。

期待看到其他更棒的扩展组件。

## 相关资料链接

Databend：https://github.com/datafuselabs/databend/

Databend Cloud: https://databend.cn

Databend 官方文档：https://docs.databend.cn

Databend Playground 扩展组件：https://github.com/datafuse-extras/databend-playground-for-kubesphere

KubeSphere：https://kubesphere.io/

KubeSphere 扩展组件开发指南：https://dev-guide.kubesphere.io/

KubeSphere 扩展组件示例：https://github.com/kubesphere/extension-samples/

## 关于 Databend Labs

「Databend Labs」成立于 2021 年 3 月 5 日，是业内领先的开源 Data Cloud 基础设施服务商，也是背后支撑 Databend 开源项目的核心团队，致力于为用户、企业提供更低成本、更高性能、更加易用的数据建设处理一站式平台。目前，Databend 已经服务于多个行业客户，其中包括互联网、金融、人工智能、能源、运营商等领域。了解更多：https://www.databend.cn/。