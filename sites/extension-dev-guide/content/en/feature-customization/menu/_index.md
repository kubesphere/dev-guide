---
title: Mount point
weight: 2
description: Describes how to configure the mount point of an extension in the KubeSphere web console.
---

This section describes how to configure the mount point of an extension in the KubeSphere web console.

### Available mount points

You can mount extensions to the following points:

* Top navigation bar

  <img src="./top-menu.png" style="max-width: 1000px; margin: 0px" />

* Platform management menu

  In the top navigation bar, click `Platform` to open the menu.

  <img src="./platform-menu.png" style="max-width: 1000px; margin: 0px" />

* Toolbox menu

  Hover over the <img src="" style="max-width: 20px; margin: 0px; display: inline; vertical-align: top" /> icon in the bottom right corner of the page to open the menu.

  <img src="./toolbox-menu.png" style="max-width: 1000px; margin: 0px" />

* Left-side navigation pane

  KubeSphere provides a left-side navigation pane for each of the following module: access control, cluster management, workspace management, project management, and platform settings. Example:

  <img src="./navigation-menu.png" style="max-width: 1000px; margin: 0px" />

### Configure a mount point

You can set the mount point in the `menu` object of `src/index.js`. For example:

```javascript
const menu = { 
  parent: 'global',
  name: 'hello-world',
  link: '/hellow-world',
  title: 'HELLO_WORLD',
  icon: 'cluster',
  order: 0,
  desc: 'HELLO_WORLD_DESC',
  skipAuth: true,
};
```

<table>
  <colsgroup>
    <col style="width: 25%;">
    <col style="width: 75%;">
  </colsgroup>
  <thead>
    <tr>
      <th>Parameter</th>
      <th>Description</th>
    </tr>
  <thead>
  <tbody>
    <tr>
      <td>parent</td>
      <td>The mount point of the extension. Valid values:
        <ul>
          <li><strong>topbar</strong>: mounts to the top navigation bar.</li>
          <li><strong>global</strong>: mounts to the platform management menu.</li>
          <li><strong>toolbox</strong>: mounts to the toolbox menu.</li>
          <li><strong>access</strong>: mounts to the left-side navigation pane on the Access Control page.</li>
          <li><strong>cluster</strong>: mounts the left-side navigation pane on the Cluster Management page.</li>
          <li><strong>workspace</strong>: mounts the left-side navigation pane on the Workspace Management page.</li>
          <li><strong>project</strong>: mounts the left-side navigation pane on the Project Management page.</li>
          <li><strong>platformSettings</strong>: mounts the left-side navigation pane on the Platform Settings page.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>name</td>
      <td>The identifier of the extension on the menu.</td>
    </tr>
    <tr>
      <td>link</td><td>The link to the extension. 目前仅对 <code>parent</code> 取值为 <code>global</code> 和 <code>topbar</code> 时有效。</td>
    </tr>
    <tr>
      <td>title</td><td>扩展组件在菜单上显示的名称。请勿直接将参数值设置为硬编码的字符串，建议将参数值设置为词条的键，并通过 KubeSphere 提供的国际化接口实现多语言。有关更多信息，请参阅<a href="../internationalization">国际化</a>。</td>
    </tr>
    <tr>
      <td>icon</td><td>扩展组件在菜单上显示的图标的名称。</td>
    </tr>
    <tr>
      <td>order</td><td>扩展组件在菜单上的排列位次，取值为 <code>0</code> 或正整数，取值 <code>0</code> 表示扩展组件在菜单首位。</td>
    </tr>
    <tr>
      <td>desc</td><td>扩展组件在菜单上显示的描述文字，目前仅对 <code>parent</code> 取值为 <code>global</code> 和 <code>toolbox</code> 时有效。请勿直接将参数值设置为硬编码的字符串，建议将参数值设置为词条的键，并通过 KubeSphere 提供的国际化接口实现多语言。有关更多信息，请参阅<a href="../internationalization">国际化</a>。</td>
    </tr>
    <tr>
      <td>skipAuth</td><td>是否跳过用户权限检查。有关更多信息，请参阅<a href="../access-control">访问控制</a>。</td>
    </tr>
  </tbody>
</table>

