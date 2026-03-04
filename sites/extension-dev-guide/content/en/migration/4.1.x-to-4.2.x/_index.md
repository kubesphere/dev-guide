---
title: Upgrade from 4.1.x to 4.2.x
weight: 98
description: Learn how to upgrade from version 4.1.x to 4.2.x.
---

### 4.2.0

#### Frontend

KubeSphere 4.2.0 introduces a redesigned UI, and the extension menu mount strategy has changed: `topbar` is no longer supported.

##### Scope of impact

- Extension frontend configurations where `menus` uses `parent: 'topbar'`.
- Clusters with `ExtensionEntry` created and `spec.entries[].parent` set to `topbar`.
- After the upgrade, entries previously mounted to `topbar` will no longer be displayed.

##### Migration steps

1. Change the `parent` of extension entries from `topbar` to `global` (including both `menus` and `ExtensionEntry`).
2. If both `menus` and `ExtensionEntry` are configured, check `ExtensionEntry` first. It has higher priority, and `menus` will be ignored.
3. Sign in to the KubeSphere Console, then pin extension entries to the top area through "Custom Component Entry" in the "Component Dock" to restore the previous `topbar` experience.
4. Refer to [Mount Point](../../feature-customization/menu/) to verify whether other menu configurations meet expectations.

##### Configuration examples

Before upgrade (`menus`):

```js
const menus = [
  {
    parent: 'topbar',
    name: 'example',
    title: 'EXAMPLE',
  },
];
```

After upgrade (`menus`):

```js
const menus = [
  {
    parent: 'global',
    name: 'example',
    title: 'EXAMPLE',
  },
];
```

Before upgrade (`ExtensionEntry`):

```yaml
spec:
  entries:
    - parent: "topbar"
      name: "example"
      title: "EXAMPLE"
```

After upgrade (`ExtensionEntry`):

```yaml
spec:
  entries:
    - parent: "global"
      name: "example"
      title: "EXAMPLE"
```
