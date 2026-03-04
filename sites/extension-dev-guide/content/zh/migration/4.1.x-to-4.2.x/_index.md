---
title: 从 4.1.x 升级到 4.2.x
weight: 98
description: 如何从 4.1.x 升级到 4.2.x 版本
---

### 4.2.0

#### 前端

4.2.0 采用了全新设计的 UI，扩展组件菜单挂载策略发生变更：`topbar` 和 `project` 不再支持。

##### 影响范围

- 前端扩展配置中 `menus.parent` 使用了 `topbar` 和 `project` 的场景。
- 集群中创建了 `ExtensionEntry`，且 `spec.entries[].parent` 使用 `topbar` 和 `project` 的场景。
- 升级后，原先挂载在 `topbar` 的入口将不再显示。
- 由于全新设计的 UI 其中一个重点就取消了「项目」的独立入口，因此原先挂载在 `project` 的入口将无法显示。

##### 迁移步骤

`topbar`

1. 将扩展入口配置中的 `parent` 从 `topbar` 改为 `global`（包括 `menus` 与 `ExtensionEntry`）。
2. 如果你同时配置了 `menus` 和 `ExtensionEntry`，请优先检查 `ExtensionEntry`。它的优先级更高，`menus` 会被忽略。
3. 登录 KubeSphere 控制台，在「组件坞」中通过「自定义组件入口」将扩展组件固定到页面顶部，以还原原先 `topbar` 的使用体验。
4. 参考[挂载位置](../../feature-customization/menu/)确认其他菜单配置是否符合预期。

`project`

1. 将扩展入口配置中的 `parent` 从 `project` 改为 `workspace`（包括 `menus` 与 `ExtensionEntry`）。
2. 如果你同时配置了 `menus` 和 `ExtensionEntry`，请优先检查 `ExtensionEntry`。它的优先级更高，`menus` 会被忽略。
3. 由于资源层级发生了变化，原先大部分的功能需要修改、适配或者重新开发，包含但不限于：交互、路径、权限等。

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
