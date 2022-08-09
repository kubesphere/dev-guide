---
title: 前端插件机制
weight: 7100
description: KubeSphere 前端端插件机制介绍
---

在 KubeSphere 4.0 中为实现“可插拔”的特性，我们设计了“微内核+插件”的架构。其中“内核”部分仅包含系统运行的必备基础功能，而将独立的业务模块分别封装在各个插件中。系统可在运行时动态的安装、卸载、启动、停止插件。架构总体设计如下图：


![前端架构](/images/pluggable-arch/frontend-framework.svg "前端架构")

## 设计思想
谈到解构“巨石应用”、谈到动态扩展，我们必然会想到近年来流行的“微前端”方案。知名的“微前端”实现比如 “qiankun”、“micro-app”为了解决子应用技术栈无关、样式侵入问题在 JS沙箱、样式隔离上做了很多工作。而“隔离”往往是为了解决某些技术债问题或者团队配合问题而做的妥协。一套前端系统里如果融合了 react、Vue、angular 那么 ui 体验的一致性则会很难保证，前端 bundle 的大小也会大大提高。而且各个子应用隔离在自己独立的运行时，与主应用融合度也不够紧密。

在 KubeSphere4.0 “可插拔”的需求背景下，我们更希望弱化隔离的要求实现一种更轻量的“微前端”，或者我们可以称之为“微模块”。在“微模块”的架构里子应用和主应用技术栈一致、可以共享运行时。这样可以做到更好的体验一致性、融合度更高、更方便实现依赖共享从而运行效率更高。如上面架构图所示，插件（子应用）的开发依赖通用的 KubeDesign、@ks-console/shared 等库。然后通过脚手架、cli 等工具打包发布。在 Core（基座）的部分实现插件的注册运行。

## 内核
如上面架构图，内核的功能主要包括：
1. 插件的管理

   插件的管理很重要的两点是在运行时完成插件 js bundle 的加载及插件的注册。在 4.0 的架构中我们采用 systemjs 实现对插件 js bundle 的加载。同时约定插件的入口规范，从而使其可以连接到核心系统中运行。
2. 通讯机制

   内核中我们内置了EventBus(pub/sub), 可以方便的在内核和插件之间、插件与插件之间进行通信。
3. 路由管理

   基于 react-router，插件定义的路由会在插件注册时统一到内核中进行管理。
4. 国际化

   基于 i18next 实现了国际化。开发者可以在插件里按 i18next 的格式去定义翻译文件，然后按约定注册到内核中。
5. 插件市场

   类似 chrome 浏览器的插件市场，我们也有一个可视化的插件管理模块，方便用户在页面上实现对插件的安装、卸载、启动、停止等操作。
6. 基础页面

   系统运行起来的一些必备的 UI 元素，包括登录页面、页面 layout 等。
7. BFF

   基于 koa 实现的 BFF 层。主要负责首页渲染、请求转发、数据转换及一些轻量的后端任务。


## 插件

前端插件统一使用 `create-ks-app` 脚手架工具初始化。初始化后目录如下图
![image alt](/images/pluggable-arch/plugin-directory.png)

可以看出这和普通的 react app 基本一样。不同的点在于对 entry 的定义。示例如下：
```javascript=
import routes from './routes';                   // 导入路由
import locales from './locales';                 // 导入国际化文件

const menu = {                                   // 定义菜单 
  parent: 'global',                              // 菜单父级
  name: 'employee',                              // 菜单 name 标识 
  link: '/employee/list',                        // 入口 url    
  title: 'EMPLOYEE_MANAGEMENT',                  // 菜单名称  
  icon: 'cluster',                               // 菜单 icon
  order: 0,                                      // 菜单排序  
  desc: 'Employee management system',            // 菜单描述
  skipAuth: true,                                // 是否忽略权限检查
};

const pluginConfig = {
  routes,
  menus: [menu],
  locales,
};
globals.context.registerPlugin(pluginConfig);    // 通过全局对象注册插件
```
如上，插件使用脚手架初始化后，定义入口文件。业务代码开发模式和普通前端项目无异。开发完成后打包发布。插件有自己独立的 repo，代码层面对内核部分没有任何侵入。

## 开发赋能
为方便开发者更高效的开发插件，同时也为了系统体验一致性的约束及运行效率的考虑，我们提供了一些通用的组件、工具等库。
1. 通用组件库 [KubeDesign](https://github.com/kubesphere/kube-design)
2. 轻量的状态管理库 @ks-console/stook
3. 通用 util 库 @ks-console/shared
4. 前端脚手架工具 [create-ks-app](https://github.com/chenz24/create-ks-app)
