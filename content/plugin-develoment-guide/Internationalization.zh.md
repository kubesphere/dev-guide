---
title: 国际化
weight: 404
description: 插件的国际化设置
---

KubeSphere 4.0 内核集成了 [i18next](https://www.i18next.com/) 作为国际化组件，插件开发者可以通过 i18next 的方式来在插件前端项目中实现国际化。

![](/images/pluggable-arch/locales.png)

如上图，在前端项目的 `locales` 目录中书写翻译文件。然后在插件的 entry file 中引入翻译文件，如下：

```js
import routes from './routes';
import locales from './locales';  // 引入翻译文件

const menu = {
  parent: 'global',
  name: 'employee',
  link: '/employee/list',
  title: 'EMPLOYEE_MANAGEMENT',
  icon: 'cluster',
  order: 0,
  desc: 'Employee management system',
  skipAuth: true,
};

const pluginConfig = {
  routes,
  menus: [menu],
  locales,
};
globals.context.registerPlugin(pluginConfig);
```

在开发中，我们可以使用全局函数 `t` 来获取翻译内容，例如：

```jsx
<WelcomeTitle>{t('WELCOME')}</WelcomeTitle>
...

<span>{t('LOG_IN_WITH_TITLE', { title: server.title })}</span>
```
