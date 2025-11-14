---
title: 自建 npm 仓库说明
weight: 02
description: 如何访问 KubeSphere 扩展组件依赖所在的 npm 仓库
---

## 如何获取仓库用户名

`@ks-console/*` 等扩展组件依赖已经迁移至自建 npm 仓库 `https://registry.npm.kubesphere.com.cn`。如需获取用户名和密码，请发送邮件至 <kubesphere@yunify.com>，并附上您的组织信息与用途说明。

## 如何配置 `.npmrc`

在扩展组件工程根目录创建或更新 `.npmrc`，并写入以下内容：

```ini
@ks-console:registry=https://registry.npm.kubesphere.com.cn
```

使用 `yarn create ks-project`（当 `create-ks-project` 版本 ≥ 4.1.3）初始化的工程默认会生成上述 `.npmrc`。如果你使用的是旧版本脚手架或已有工程，请手动追加该配置。

## 如何登录仓库

完成 `.npmrc` 配置后，使用以下命令登录仓库，并在提示时依次输入用户名、密码：

```shell
npm login --registry https://registry.npm.kubesphere.com.cn
```

## 如何验证连接

运行以下命令验证网络连通性与凭据状态：

```shell
npm ping --registry https://registry.npm.kubesphere.com.cn
npm whoami --registry https://registry.npm.kubesphere.com.cn
```

```text
npm notice PING https://registry.npm.kubesphere.com.cn/
npm notice PONG 150ms
<your-username>
```

如输出所示，只要能够收到 `PONG` 并看到自己的用户名（上述示例中的 `<your-username>`），说明网络和凭据均配置正确。

{{% notice warning %}}
我们计划在 2025 年 11 月 30 日删除 `https://www.npmjs.com` 上的所有 `@ks-console/*` 包。届时 npmjs.com 上的依赖将无法使用，如果安装命令仍指向官方 npm Registry 会因为无法拉取到依赖而失败。请务必确认 Yarn/npm 均指向 `https://registry.npm.kubesphere.com.cn` 后再执行安装或升级操作。
{{% /notice %}}
