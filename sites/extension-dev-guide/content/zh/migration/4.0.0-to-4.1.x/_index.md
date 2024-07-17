---
title: 从 4.0.0 升级到 4.1.x
weight: 01
description: 如何从 4.0.0 升级到 4.1.x 版本
---

### 前端

#### 扩展组件配置修改

从 KubeSphere 4.1.0 开始，扩展组件前端需要把配置导出

```js
export default extensionConfig;
```

而不是之前的注册扩展组件

```js
globals.context.registerExtension(extensionConfig);
```
