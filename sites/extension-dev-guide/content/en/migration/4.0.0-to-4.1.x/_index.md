---
title: Upgrade from 4.0 to 4.1.x
weight: 01
description: Learn how to upgrade from version 4.0.0 to 4.1.x.
---

### 4.1.2

#### Frontend

All `@ks-console/*` dependencies are available only on <https://registry.npm.kubesphere.com.cn>. See the [Private npm Registry](../../faq/private-registry/) guide for username requests, `.npmrc` configuration, and verification instructions before installing.

##### Install/Upgrade KubeSphere Dependencies

Install/Upgrade `create-ks-project`.

```shell
npm install -g create-ks-project
```

Install/Upgrade KubeSphere Console dependencies.

- [`@ks-console/appstore`](https://registry.npm.kubesphere.com.cn/-/web/detail/@ks-console/appstore)
- [`@ks-console/bootstrap`](https://registry.npm.kubesphere.com.cn/-/web/detail/@ks-console/bootstrap)
- [`@ks-console/console`](https://registry.npm.kubesphere.com.cn/-/web/detail/@ks-console/console)
- [`@ks-console/core`](https://registry.npm.kubesphere.com.cn/-/web/detail/@ks-console/core)
- [`@ks-console/locales`](https://registry.npm.kubesphere.com.cn/-/web/detail/@ks-console/locales)
- [`@ks-console/server`](https://registry.npm.kubesphere.com.cn/-/web/detail/@ks-console/server)
- [`@ks-console/shared`](https://registry.npm.kubesphere.com.cn/-/web/detail/@ks-console/shared)

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

{{% notice note %}}
The versions of `@ks-console/*` should ideally match the version of KubeSphere. Double-check that Yarn/npm reads from the private registry; otherwise, installation may fail once <https://www.npmjs.com> stops serving these packages.
{{% /notice %}}

Install/Upgrade Kube Design.

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

If the version of `@ks-console/*` is >=4.1.0, you need to upgrade Kube Design and other dependencies to the latest version.

Otherwise, you may encounter error messages when running and packaging locally.

##### Changes in External Dependencies for Extensions

Before KubeSphere 4.1.2, the core provided some commonly used dependency libraries, and extensions could directly import and use these dependencies without installing them. These dependencies were called external dependencies for extensions.

However, if the external dependencies of extensions caused functional anomalies, the extensions had to wait for the core to update the dependencies to fix them. This clearly violated the original intention of the extension mechanism.

Therefore, starting from 4.1.2, some external dependencies for extensions are removed as follows:

- lodash
- react-is
- react-markdown

If extensions need to use these libraries, they need to install them themselves. The import and usage methods remain unchanged.

##### Split Webpack Custom Configuration

Before KubeSphere 4.1.2, there was only one Webpack custom configuration file, `configs/webpack.config.js`. This file was used for both local running of KubeSphere Console (`yarn dev` and `yarn dev:client`) and packaging of extension frontend (`yarn build:ext`).

Starting from 4.1.2, the Webpack custom configuration file is split into two:

- `configs/webpack.config.js`: Used for local running of KubeSphere Console (`yarn dev` and `yarn dev:client`).
- `configs/webpack.extensions.config.js`: Used for packaging extension frontend (`yarn build:ext`).

##### Deprecate Local Production Mode

Since you can directly access the KubeSphere Console to view extensions, there is no longer a need for local production mode.

Therefore, the `build:prod` and `start` commands in the `scripts` section of `package.json` are deprecated.

### 4.1.0

#### Frontend

##### Changes in Extension Configuration

Starting from KubeSphere 4.1.0, extensions need to export their configuration

```js
export default extensionConfig;
```

instead of the previous way of registering extensions.

```js
globals.context.registerExtension(extensionConfig);
```
