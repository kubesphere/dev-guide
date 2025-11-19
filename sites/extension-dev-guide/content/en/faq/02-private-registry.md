---
title: Private npm Registry
weight: 02
description: How to access the npm registry that hosts KubeSphere extension dependencies.
---

## How do I get credentials?

Dependencies such as `@ks-console/*` have been migrated to the private npm registry at <https://registry.npm.kubesphere.com.cn>. Email [kubesphere@yunify.com](mailto:kubesphere@yunify.com) with your organization details and use cases to request the username and password. Please avoid sharing the same account across different teams to keep the credentials secure.

## How do I configure `.npmrc`?

Create or update the `.npmrc` file in the root directory of your extension project and add the following line:

```ini
@ks-console:registry=https://registry.npm.kubesphere.com.cn
```

Projects bootstrapped with `yarn create ks-project` (when `create-ks-project` is v4.1.3 or later) already contain this configuration. If you are using an older scaffold version or an existing project, append the entry manually.

## How do I log in?

After configuring `.npmrc`, run the following command and enter the username and password when prompted:

```shell
npm login --registry https://registry.npm.kubesphere.com.cn
```

For example:

```text
npm notice Log in on https://registry.npm.kubesphere.com.cn/
Username: <YOUR-USERNAME>
Password:

Logged in on https://registry.npm.kubesphere.com.cn/.
```

## How do I verify the connection?

Use the following commands to check connectivity and credential status:

```shell
npm ping --registry https://registry.npm.kubesphere.com.cn
npm whoami --registry https://registry.npm.kubesphere.com.cn
```

For example:

```text
npm notice PING https://registry.npm.kubesphere.com.cn/
npm notice PONG 150ms
<YOUR-USERNAME>
```

When you see the `PONG` message together with your username (for example `<YOUR-USERNAME>` above), it means your network and credentials are working as expected.

{{% notice warning %}}
We plan to remove all `@ks-console/*` packages from <https://www.npmjs.com> in the future. After that, npmjs.org will no longer serve these dependencies, and installations fail if npm/Yarn still points to the public registry. Always ensure the registry URL is <https://registry.npm.kubesphere.com.cn> before installing or upgrading.
{{% /notice %}}
