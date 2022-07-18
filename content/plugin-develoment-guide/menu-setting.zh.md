---
title: 菜单设置
weight: 403
description: 插件的菜单挂载
---

## 菜单挂载点
插件入口菜单目前有四种挂载点：顶部导航栏、平台管理、左侧菜单、工具箱。如图

1. 顶部导航栏
![](/images/plugin-arch/menu1.png)

2. 平台管理
![](/images/plugin-arch/menu2.png)

3. 左侧菜单
   ![](/images/plugin-arch/menu4.png)
4. 工具箱
   ![](/images/plugin-arch/menu3.png)

## 挂载设置
插件的入口菜单放置在何处，是在插件的 entry file 里设置的，如下面代码

```javascript
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

通过 `menu` 的 parent 字段设置挂载点：
* 当值为 `top` 时菜单挂载在顶部导航栏；
* 当值为 `global` 时菜单挂载在平台管理菜单；
* 当值为 `toolbox` 时菜单挂载在工具箱。
* 左侧菜单的挂载需根据当前 menu 在系统配置文件 `config.yaml` 里的配置来设置，如：
```yaml
  clusterNavs:
    name: cluster
    children:
      - name: overview
        title: OVERVIEW
        icon: dashboard
        skipAuth: true
        showInDisable: true
      - name: nodes
        title: NODE_PL
        icon: nodes
        children:
          - { name: nodes, title: CLUSTER_NODE_PL }
          - { name: edgenodes, title: EDGE_NODE_PL, clusterModule: kubeedge }
      - { name: components, title: SYSTEM_COMPONENT_PL, icon: components }
      - { name: projects, title: PROJECT_PL, icon: project }
      - name: app-workloads
        title: APPLICATION_WORKLOAD_PL
        icon: appcenter
        children:
          - name: workloads
            title: WORKLOAD_PL
            tabs:
              - { name: deployments, title: DEPLOYMENT_PL }
              - { name: statefulsets, title: STATEFULSET_PL }
              - { name: daemonsets, title: DAEMONSET_PL }
          - name: jobs
            title: JOB_PL
            tabs:
              - { name: jobs, title: JOB_PL }
              - { name: cronjobs, title: CRONJOB_PL }
          - { name: pods, title: POD_PL }
          - { name: services, title: SERVICE_PL }
          - { name: ingresses, title: ROUTE_PL }
      - name: config
        title: CONFIGURATION
        icon: hammer
        children:
          - { name: secrets, title: SECRET_PL }
          - { name: configmaps, title: CONFIGMAP_PL }
          - {
            name: serviceaccounts,
            title: SERVICE_ACCOUNT_PL,
            requiredClusterVersion: v3.1.0,
          }
      - name: network
        title: NETWORK
        icon: earth
        children:
          - {
            name: networkpolicies,
            title: NETWORK_POLICY_PL,
            clusterModule: network,
          }
          - {
            name: ippools,
            title: POD_IP_POOL_PL,
            clusterModule: "network.ippool",
          }
 ...
```
在 `congfig.yaml` 里，集群管理的菜单配置如上代码所示。假如我们要把插件的入口放到集群管理侧边栏，我们可以把 parent 值设置成 `cluster`。

菜单的挂载也支持多级。比如我们想把插件的入口点放到"集群管理-节点管理""下。我们可以把 parent 值设置成 `cluster.nodes`
