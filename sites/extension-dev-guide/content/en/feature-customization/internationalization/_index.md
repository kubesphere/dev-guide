---
title: Internationalization
weight: 05
description: Describes how to internationalize frontend extensions.
---

This section describes how to internationalize frontend extensions.

KubeSphere Core integrates [i18next](https://www.i18next.com/) as an internationalization component. You can use custom language packages to enable multi-language extensions.

## Language packages

KubeSphere provides language packages for frontend extensions in the directory `src/locales`. By default, language packages `en` and `zh` are created. You can also create other language packages as needed. The UI text for each language is stored in JSON files. You can create multiple JSON files in language packages.

```shell
kubesphere-extensions
└── frontend
    └── extensions
        └── hello-world
            └── src
                └── locales
                    ├── en
                    │   ├── base.json
                    │   └── index.js
                    ├── index.js
                    └── zh
                        ├── base.json
                        └── index.js
```

## Development process

The following takes the [Hello World](../../quickstart/hello-world-extension/) extension as an example to demonstrate how to display `Hello World! The current language code is {languageCode}.` and `你好世界！当前的语言代码为 {languageCode}`。Also, this example shows how to replace `{languageCode}` with the language code of a local environment.

1. In `src/locales/en/base.json` and `src/locales/zh/base.json`, add the following text:

   ```json
   // src/locales/en/base.json
   {
     "HELLO_WORLD_DESC": "Hello World! The current language code is {languageCode}."
   }
   ```

   ```json
   // src/locales/zh/base.json
   {
     "HELLO_WORLD_DESC": "你好世界！当前的语言代码为 {languageCode}。"
   }
   ```

2. Import the language package in `src/index.js`:

   ```js
   import routes from './routes';
   import locales from './locales';  // Import the language package

   onst menu = {
     parent: 'topbar',
     name: 'hello-world',
     link: '/hello-world',
     title: 'HELLO_WORLD',
     icon: 'cluster',
     order: 0,
     desc: 'HELLO_WORLD_DESC',
     skipAuth: true,
   };

   const extensionConfig = {
     routes,
     menus: [menu],
     locales,
   };

   globals.context.registerExtension(extensionConfig);
   ```

3. In the development of the frontend extension, use the global function `t()` to obtain the text content and pass the value to the variable. For example, use the following code in the `src/App.jsx` file:

   ```jsx
   export default function App() {
     return <Wrapper>{t('HELLO_WORLD_DESC', {languageCode: globals.user.lang})}</Wrapper>;
   }
   ```

4. Run the `yarn dev` command in the `frontend` directory to launch the frontend environment.

5. Visit and log in to `http://localhost:8000`, click the current user's name in the upper right corner of the page, and then select `User Settings` to switch the language.

   Clicking `Hello World` in the `English` and `Simplified Chinese` language environments will display the following text respectively:

   <img src="./locale-demo-en.png" style="margin: 0px" />

   <img src="./locale-demo-zh.png" style="margin: 20px 0px 0px" />
