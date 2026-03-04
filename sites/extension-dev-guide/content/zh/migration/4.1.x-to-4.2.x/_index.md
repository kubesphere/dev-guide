---
title: 从 4.1.x 升级到 4.2.x
weight: 01
description: 如何从 4.1.x 升级到 4.2.x 版本
---

### 4.2.0

#### 前端

4.2.0 采用了全新设计的 UI，扩展组件菜单挂载策略发生变更：`topbar` 不再支持。

##### 影响范围

- 前端扩展配置中 `menus` 使用了 `parent: 'topbar'` 的场景。
- 升级后，原先挂载在 `topbar` 的入口将不再显示。

##### 迁移步骤

1. 将扩展入口配置中的 `parent` 从 `topbar` 改为 `global`。
2. 登录 KubeSphere 控制台，在「组件坞」中通过「自定义组件入口」将扩展组件固定到页面顶部，以还原原先 `topbar` 的使用体验。
3. 参考[挂载位置](../../feature-customization/menu/)确认其他菜单配置是否符合预期。

##### 配置示例

升级前：

```js
const menus = [
  {
    parent: 'topbar',
    name: 'example',
    title: 'EXAMPLE',
  },
];
```

升级后：

```js
const menus = [
  {
    parent: 'global',
    name: 'example',
    title: 'EXAMPLE',
  },
];
```
