---
title: 挂载位置
weight: 03
description: 介绍如何设置扩展组件在 KubeSphere Web 控制台的挂载位置
---

本章节介绍如何设置扩展组件在 KubeSphere Web 控制台的挂载位置。

### 可选挂载位置

扩展组件可以挂载到以下位置：

* 顶部菜单栏

  <img src="./top-menu.png" style="max-width: 1000px; margin: 0px">

* 扩展组件菜单

  在顶部菜单栏点击 <img src="./grid.svg" style="max-width: 20px; margin: 0px; display: inline; vertical-align: top"> 图标打开菜单。

  <img src="./platform-menu.png" style="max-width: 1000px; margin: 0px">

* 左侧导航栏
  
  KubeSphere 在集群管理、企业空间管理、项目管理、用户和角色管理、以及平台设置页面提供左侧导航栏。集群管理页面的左侧导航栏如下图所示。

  <img src="./navigation-menu.png" style="max-width: 1000px; margin: 0px">

### 设置挂载位置

在扩展组件前端源代码的入口文件（如 `src/index.js`）中的 `menus` 设置挂载位置，例如：

```javascript
const menus = [
  { 
    parent: 'global',
    name: 'hello-world',
    link: '/hellow-world',
    title: 'HELLO_WORLD',
    icon: 'cluster',
    order: 0,
    desc: 'HELLO_WORLD_DESC',
    authKey: 'hello',
    authAction: 'hello-view',
    skipAuth: true,
    isCheckLicense: false,
  }
];
```

<table>
  <colsgroup>
    <col style="width: 25%;">
    <col style="width: 75%;">
  </colsgroup>
  <thead>
    <tr>
      <th>参数</th>
      <th>描述</th>
    </tr>
  <thead>
  <tbody>
    <tr>
      <td>parent</td>
      <td>扩展组件的挂载位置，取值可以为：
        <ul>
          <li><strong>global</strong>：挂载到扩展组件菜单。</li>
          <li><strong>access</strong>：挂载到用户和角色管理页面左侧导航栏。</li>
          <li><strong>cluster</strong>：挂载到集群管理页面左侧导航栏。</li>
          <li><strong>workspace</strong>：挂载到企业空间管理页面左侧导航栏。</li>
          <li><strong>project</strong>：挂载到项目管理页面左侧导航栏。</li>
          <li><strong>platformSettings</strong>：挂载到平台设置页面左侧导航栏。</li>
        </ul>
        若要挂载到当前菜单的子菜单下，设置 parent 的路径为： <code>parent: 'cluster.xxxx.xxxx'</code>
      </td>
    </tr>
    <tr>
      <td>name</td>
      <td>
        <p>扩展组件在菜单上的位置标识。</p>
        <p>菜单的权限校验默认以 name 作为 key。设置 authKey 以指定模块权限进行校验。有关更多信息，请参阅<a href="../access-control">访问控制</a>。 </p>
      </td>
    </tr>
    <tr>
      <td>link</td><td>扩展组件的跳转路径。目前仅对 <code>parent</code> 取值为 <code>global</code> 和 <code>topbar</code> 时有效。</td>
    </tr>
    <tr>
      <td>title</td><td>扩展组件在菜单上显示的名称。请勿直接将参数值设置为硬编码的字符串，建议将参数值设置为词条的键，并通过 KubeSphere 提供的国际化接口实现多语言。有关更多信息，请参阅<a href="../internationalization">国际化</a>。</td>
    </tr>
    <tr>
      <td>icon</td><td>扩展组件在菜单上显示的图标的名称。</td>
    </tr>
    <tr>
      <td>order</td><td>扩展组件在菜单上的排列位次，取值为 <code>0</code> 或正整数。若取值为 <code>0</code>，表示扩展组件在菜单首位。</td>
    </tr>
    <tr>
      <td>desc</td><td>扩展组件在菜单上显示的描述文字，目前仅对 <code>parent</code> 取值为 <code>global</code> 时有效。请勿直接将参数值设置为硬编码的字符串，建议将参数值设置为词条的键，并通过 KubeSphere 提供的国际化接口实现多语言。有关更多信息，请参阅<a href="../internationalization">国际化</a>。</td>
    </tr>
    <tr>
      <td>skipAuth</td><td>是否跳过用户权限检查。有关更多信息，请参阅<a href="../access-control">访问控制</a>。</td>
    </tr>
    <tr>
      <td>authKey</td><td>配置权限过滤。有关更多信息，请参阅<a href="../access-control">访问控制</a>。</td>
    </tr>
    <tr>
      <td>authAction</td><td>配置权限项。有关更多信息，请参阅<a href="../access-control">访问控制</a>。</td>
    </tr>
     <tr>
      <td>isCheckLicense</td>
      <td>是否检测扩展组件许可，默认为 false</td>
    </tr>
  </tbody>
</table>
