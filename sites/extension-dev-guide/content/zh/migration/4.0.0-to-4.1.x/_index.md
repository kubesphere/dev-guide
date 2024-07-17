---
title: 从 4.0.0 升级到 4.1.x
weight: 01
description: 如何从 4.0.0 升级到 4.1.x 版本
---

### 前端

#### 扩展组件配置方式改变

从 KubeSphere 4.1.0 开始，扩展组件前端需要把配置导出

```js
export default extensionConfig;
```

而不是之前的注册扩展组件

```js
globals.context.registerExtension(extensionConfig);
```

#### 扩展组件外部依赖改变

KubeSphere 4.1.0 之前，core 会提供一些常用的依赖库，扩展组件不用安装这些依赖即可直接 import 使用，这些依赖被称为扩展组件的外部依赖。

但是如果扩展组件外部依赖导致扩展组件的功能出现异常时，扩展需要等待 core 更新依赖才能修复异常。这显然是违背扩展机制的初衷。

因此，我们从 4.1.0 开始，移除了一些扩展组件的外部依赖，具体如下。

- lodash
- react-is
- react-markdown

扩展组件如需使用，需要自行安装，import 和使用方法不变。

#### 拆分 Webpack 自定义配置

KubeSphere 4.1.0 之前，只有一个 Webpack 定义配置文件，即 `configs/webpack.config.js` ，这个配置文件即负责执行 `yarn dev:client` 和 `yarn build:prod` 时的 Webpack 定义配置，同时也负责执行 `yarn build:ext` 时的 Webpack 自定义配置。

从 4.1.0 开始，`configs/webpack.config.js` 只会与执行 `yarn dev:client` 和 `yarn build:prod` 的 Webpack 默认配置合并；新增了一个 `configs/webpack.extensions.config.js` ，该文件会与执行 `yarn build:ext` 的 Webpack 默认配置合并。

#### 错误处理

如果在扩展组件前端开发和打包过程中，终端出现报错信息，请将 `@ks-console/*` 和 `@kubed/*` 等依赖升级到最新版本（npm tag 为 latest）后再次尝试。
