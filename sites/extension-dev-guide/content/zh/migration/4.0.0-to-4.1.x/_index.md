---
title: 从 4.0 升级到 4.1
weight: 01
description: 如何从 4.0.0 升级到 4.1.x 版本
---

### 前端

#### 安装/升级 KubeSphere 依赖包

##### 安装/升级 `create-ks-project`

```shell
npm install -g create-ks-project
```

安装/升级 KubeSphere Console 依赖包

- [`@ks-console/appstore`](https://www.npmjs.com/package/@ks-console/appstore)
- [`@ks-console/bootstrap`](https://www.npmjs.com/package/@ks-console/bootstrap)
- [`@ks-console/console`](https://www.npmjs.com/package/@ks-console/console)
- [`@ks-console/core`](https://www.npmjs.com/package/@ks-console/core)
- [`@ks-console/locales`](https://www.npmjs.com/package/@ks-console/locales)
- [`@ks-console/server`](https://www.npmjs.com/package/@ks-console/server)
- [`@ks-console/shared`](https://www.npmjs.com/package/@ks-console/shared)

```shell
yarn add -W \
  @ks-console/appstore@latest \
  @ks-console/bootstrap@latest \
  @ks-console/console@latest \
  @ks-console/core@latest \
  @ks-console/locales@latest \
  @ks-console/server@latest \
  @ks-console/shared@latest
```

安装/升级 Kube Design

- [`@kubed/charts`](https://www.npmjs.com/package/@kubed/charts)
- [`@kubed/code-editor`](https://www.npmjs.com/package/@kubed/code-editor)
- [`@kubed/components`](https://www.npmjs.com/package/@kubed/components)
- [`@kubed/diff-viewer`](https://www.npmjs.com/package/@kubed/diff-viewer)
- [`@kubed/hooks`](https://www.npmjs.com/package/@kubed/hooks)
- [`@kubed/icons`](https://www.npmjs.com/package/@kubed/icons)
- [`@kubed/log-viewer`](https://www.npmjs.com/package/@kubed/log-viewer)

```shell
yarn add -W \
  @kubed/charts@latest \
  @kubed/code-editor@latest \
  @kubed/components@latest \
  @kubed/diff-viewer@latest \
  @kubed/hooks@latest \
  @kubed/icons@latest \
  @kubed/log-viewer@latest
```

如果 @ks-console/\* 版本 >=4.1.0，需要将 Kube Design 等依赖升级到最新版本。

否则在本地运行和打包时，可能会出现报错信息。

#### 扩展组件配置方式改变

从 KubeSphere 4.1.0 开始，扩展组件前端需要把配置导出

```js
export default extensionConfig;
```

而不是之前的注册扩展组件方式

```js
globals.context.registerExtension(extensionConfig);
```

#### 扩展组件外部依赖改变

在 KubeSphere 4.1.0 之前，core 会提供一些常用的依赖库，扩展组件无需安装这些依赖即可直接 import 使用，这些依赖被称为扩展组件的外部依赖。

然而，如果扩展组件的外部依赖导致功能异常时，扩展组件需要等待 core 更新依赖才能修复。这显然违背了扩展机制的初衷。

因此，从 4.1.0 开始，我们移除了一些扩展组件的外部依赖，具体如下：

- lodash
- react-is
- react-markdown

扩展组件如需使用这些库，需要自行安装，import 和使用方法不变。

#### 拆分 Webpack 自定义配置

在 KubeSphere 4.1.0 之前，只有一个 Webpack 自定义配置文件，即 `configs/webpack.config.js`。该文件既用于本地运行 KubeSphere Console（`yarn dev` 和 `yarn dev:client`）时的 Webpack 自定义配置，又用于打包扩展组件前端（`yarn build:ext`）时的 Webpack 自定义配置。

从 4.1.0 开始，Webpack 自定义配置文件分为 2 个：

- `configs/webpack.config.js`：用于本地运行 KubeSphere Console（`yarn dev` 和 `yarn dev:client`）的 Webpack 自定义配置。
- `configs/webpack.extensions.config.js`：用于打包扩展组件前端（`yarn build:ext`）的 Webpack 自定义配置。

#### 弃用本地 production 模式

由于可以直接访问远端的 KubeSphere Console 查看扩展组件，因此不再需要本地的 production 模式。

因此，弃用 `package.json` 中 `scripts` 的 `build:prod` 和 `start` 命令。
