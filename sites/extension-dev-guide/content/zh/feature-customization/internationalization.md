---
title: 国际化
weight: 05
description: 国际化多语言的支持
---

KubeSphere 4.0 内核集成了 [i18next](https://www.i18next.com/) 作为国际化组件，扩展组件开发者可以通过自定义语言包的方式在扩展组件前端项目中实现国际化。

## 语言包

我们使用 `yarn create:ext` 初始化扩展组件目录后。默认会生成 locales 文件夹。如我们在[Hello World 入门教程](zh/quickstart/hello-world-extension/)里生成下面的目录结构：

```shell
.
├── babel.config.js
├── configs
│   ├── config.yaml
│   ├── console.config.js
│   └── local_config.yaml
├── extensions
│   ├── entry.ts
│   └── hello-world
│       ├── Dockerfile
│       ├── README.md
│       ├── package.json
│       └── src
│           ├── App.jsx
│           ├── index.js
│           ├── locales
│           │   ├── en
│           │   │   ├── base.json
│           │   │   └── index.js
│           │   ├── index.js
│           │   └── zh
│           │       ├── base.json
│           │       └── index.js
│           └── routes
│               └── index.js
├── node_modules
├── package.json
├── tsconfig.base.json
├── tsconfig.json
└── yarn.lock
```

我们看到在 `hello-world/src/locales` 目录下默认有 zh(中文) en(英文) 两个目录。其中目录内的 index.js 是索引文件，能够自动索引目录内的 JSON 文件。翻译的文本放在目录内的 json 文件里，如 base.json。
如果想增加语言包，可以参照 `zh` 或 `en` 目录的内容格式，添加新的语言目录。

> 如果翻译的文本条目很多，建议按照模块或者页面将翻译的文本放到不同的 JSON 文件中。


## 使用方法

1. 在 JSON 文件里书写翻译条目，书写方法可参考 [i18next](https://www.i18next.com/) 的使用方法。如：

```json
{
  "HELLO_WORLD": "你好世界",
  "KEY_WITH_COUNT": "{{count}} item"
}
```    
   

2. 在扩展组件的 entry file（如上述扩展组件里指的是 hello-world/src/index.js）中引入翻译文件，如下：

```js
import routes from './routes';
import locales from './locales';  // 引入翻译文件

const menu = {
  parent: 'topbar',
  name: 'hello-world',
  link: '/hello-world',
  title: 'HELLO_WORLD',
  icon: 'cluster',
  order: 0,
  desc: 'SAY_HELLO_WORLD',
  skipAuth: true,
};

const extensionConfig = {
  routes,
  menus: [menu],
  locales,
};

globals.context.registerExtension(extensionConfig);
```

3. 在开发中，我们可以使用全局函数 `t` 来获取翻译内容，例如：

```jsx
<WelcomeTitle>{t('HELLO_WORLD')}</WelcomeTitle>
...

<span>{t('KEY_WITH_COUNT', { count: server.count })}</span>
```
