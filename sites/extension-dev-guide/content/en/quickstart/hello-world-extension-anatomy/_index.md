---
title: How the Hello World extension works
weight: 3
description: Describes how the Hello World extension works.
---

In the previous section, the KubeSphere web console runs locally and the extension is loaded properly. This topic describes how the extension works.

The Hello World extension provides the following features:

1. Register a menu button on the top navigation bar for quick access to the pages of the extension.
2. Add an independent page route. When a user visits `http://localhost:8000/hello-world`, an extension page can be rendered correctly.
3. Implement the extension pages.

These three features are crucial for developing a KubeSphere extension. Let's take a closer look at the file structure and source code of the Hello World extension to learn more about how these features are implemented.

**Directory for the extension**

```bash
$ tree extensions/hello-world 
extensions/hello-world
├── Dockerfile
├── README.md
├── package.json
└── src
    ├── App.jsx
    ├── index.js
    ├── locales
    │   ├── en
    │   │   ├── base.json
    │   │   └── index.js
    │   ├── index.js
    │   └── zh
    │       ├── base.json
    │       └── index.js
    └── routes
        └── index.js
```

### Configure basic information for the extension

The `package.json` file contains the basic information about the extension and `Node.js` metadata.

```json
{
  "name": "hello-world",
  "description": "Hello World!",
  "author": "",
  "version": "1.0.0",
  "homepage": "",
  "main": "dist/index.js",
  "files": [
    "dist"
  ],
  "dependencies": {}
}
```

### Features

Use `src/index.js` to register [navigation bars](../../feature-customization/menu/) and [internationalization modules](../../feature-customization/internationalization/) to ks-console.

```js
import routes from './routes';
import locales from './locales';

const menu = {
  parent: 'topbar',
  name: 'hello-world',
  title: 'Hello World',
  icon: 'cluster',
  order: 0,
  desc: 'Hello World!',
  skipAuth: true,
};

const extensionConfig = {
  routes,
  menus: [menu],
  locales,
};

globals.context.registerExtension(extensionConfig);
```

Use `src/routes/index.js` to register [page routes](../../feature-customization/route) to ks-console, and extension pages can be rendered correctly when you access the pages.

```js
import React from 'react';
import App from '../App';

export default [
  {
    path: '/hello-world',
    element: <App />,
  },
];

```

### Implementation

`src/App.jsx` implements specific features and displays `Hello World!`.

```jsx
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.h3`
  margin: 8rem auto;
  text-align: center;
`;

export default function App() {
  return <Wrapper>Hello World!</Wrapper>;
}
```

### Learn More

In this quickstart, you get to know how to create, run, and debug the frontend of a simple extension. A complete extension should include frontend and backend capabilities, and even need to integrate with external systems or tools through APIs. At the same time, the extension also needs to be packaged and deployed. You can also publish to the Extension Center to share the extension with others. Here are some suggested learning paths to further improve your skills in developing KubeSphere extensions:

[System architecture](../../architecture) This section describes the system architecture of KubeSphere LuBan and its extension mechanism.

[Custom features](../../feature-customization) In this section, we divide the KubeSphere API and extensions into several categories according to their functionality, and each category has a short description about what features your extension can achieve. You can learn about KubeSphere's extensibility capabilities by looking at the KubeSphere API.

[Examples](../../examples) This section describes a large number of examples or video tutorials, including some guides to interpreting the source code in detail. You can find all samples and guides in [extension-samples](https://github.com/kubesphere/extension-samples).

[Package and release](../../packaging-and-release) This section describes how to use the tool ksbuilder to package and test extensions, and how to release them to the Extension Center.

[Best practices](../../best-practices) This section introduces a number of best practices for creating extension UIs to help your extensions fit seamlessly into the KubeSphere web console.

