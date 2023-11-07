---
title: How the Hello World Extension Works
weight: 3
description: Describes how the Hello World extension works.
---

In the previous section, you have learned how to run the KubeSphere web console locally and load the extension. This topic describes how the extension works.

When loading the Hello World extension, it performs the following three key tasks, which are critical to the development of KubeSphere extensions.

1. Register a menu button on the top navigation bar for quick access to the pages of the extension.
2. Add an independent page route. When a user visits `http://localhost:8000/hello-world`, an extension page can be rendered correctly.
3. Implement the extension pages.

Let's take a deeper look at the file structure and source code of the Hello World extension to learn more about how these features are implemented.

### Directory structure

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

### Basic information

The `package.json` file contains the basic information about the extension and the `Node.js` metadata.

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

Use `src/index.js` to register [navigation menus](../../feature-customization/menu/) and [internationalization modules](../../feature-customization/internationalization/) with ks-console.

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

Use `src/routes/index.js` to register [page routes](../../feature-customization/route) with ks-console, and extension pages can be rendered correctly when you access the pages.

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
