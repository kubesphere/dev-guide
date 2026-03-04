---
title: 从 4.1.x 升级到 4.2.x
weight: 98
description: 如何从 4.1.x 升级到 4.2.x 版本
---

### 4.2.0

#### 前端

KubeSphere 4.2.0 引入了全新 UI，扩展入口挂载策略发生变更：`topbar` 和 `project` 不再支持。

##### 影响范围

- 前端扩展配置中，`menus.parent` 使用 `topbar` 或 `project` 的场景。
- 集群中创建了 `ExtensionEntry`，且 `spec.entries[].parent` 使用 `topbar` 或 `project` 的场景。
- 升级后，原先挂载在 `topbar` 与 `project` 的入口将不再显示。

##### 升级前检查

1. 全量检查 `menus` 配置中的 `parent` 字段。
2. 全量检查 `ExtensionEntry.spec.entries[].parent` 字段。
3. 如果同时存在 `menus` 与 `ExtensionEntry`，优先核对 `ExtensionEntry`（其优先级更高，`menus` 会被忽略）。

##### 迁移步骤

###### `topbar` 迁移到 `global`

1. 将扩展入口配置中的 `parent` 从 `topbar` 改为 `global`（包括 `menus` 与 `ExtensionEntry`）。
2. 登录 KubeSphere 控制台，在「组件坞」中通过「自定义组件入口」将扩展入口固定到页面顶部，以还原原先 `topbar` 的使用体验。
3. 参考[挂载位置](../../feature-customization/menu/)确认其他菜单配置是否符合预期。

###### `project` 迁移到 `workspace`

1. 将扩展入口配置中的 `parent` 从 `project` 改为 `workspace`（包括 `menus` 与 `ExtensionEntry`）。
2. 由于资源层级发生变化，原先多数功能需要重新适配或重构，包含但不限于：交互、路由路径、权限模型等。

##### 配置示例（以迁移 `topbar` 为例）

`menus` 升级前：

```js
const menus = [
  {
    parent: 'topbar',
    name: 'example',
    title: 'EXAMPLE',
  },
];
```

`menus` 升级后：

```js
const menus = [
  {
    parent: 'global',
    name: 'example',
    title: 'EXAMPLE',
  },
];
```

`ExtensionEntry` 升级前：

```yaml
spec:
  entries:
    - parent: "topbar"
      name: "example"
      title: "EXAMPLE"
```

`ExtensionEntry` 升级后：

```yaml
spec:
  entries:
    - parent: "global"
      name: "example"
      title: "EXAMPLE"
```
