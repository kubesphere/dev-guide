---
title: Upgrade from 4.1.x to 4.2.x
weight: 98
description: Learn how to upgrade from version 4.1.x to 4.2.x.
---

### 4.2.0

#### Frontend

KubeSphere 4.2.0 introduces a redesigned UI, and the extension entry mount strategy has changed: `topbar` and `project` are no longer supported.

##### Scope of impact

- Scenarios in frontend extension configurations where `menus.parent` uses `topbar` or `project`.
- Scenarios where `ExtensionEntry` is created in the cluster and `spec.entries[].parent` uses `topbar` or `project`.
- After the upgrade, entries previously mounted to `topbar` and `project` will no longer be displayed.

##### Pre-upgrade checks

1. Check all `parent` fields in `menus`.
2. Check all `ExtensionEntry.spec.entries[].parent` fields.
3. If both `menus` and `ExtensionEntry` exist, verify `ExtensionEntry` first (it has higher priority and `menus` will be ignored).

##### Migration steps

Migrate `topbar` to `global`

1. Change `parent` from `topbar` to `global` for extension entries (including both `menus` and `ExtensionEntry`).
2. Sign in to the KubeSphere Console, then pin extension entries to the top area through "Custom Component Entry" in the "Component Dock" to restore the previous `topbar` experience.
3. Refer to [Mount Point](../../feature-customization/menu/) to verify whether other menu configurations meet expectations.

Migrate `project` to `workspace`

1. Change `parent` from `project` to `workspace` for extension entries (including both `menus` and `ExtensionEntry`).
2. Because the resource hierarchy changes, most existing features require re-adaptation or refactoring, including but not limited to interactions, route paths, and permission models.

##### Configuration examples (migrating `topbar` as an example)

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
