---
title: 第三方系统集成
weight: 07
description: 快速集成已有 Web UI 的第三方工具与系统
---

## 前端集成

KubeSphere 4.0 以 iframe 的形式，将已有 Web UI 的第三方工具与系统集成进来。

### 嵌入 iframe

我们可以在扩展组件的 `src/App.jsx` 文件或者任意 React 组件中，嵌入 `iframe`。

```jsx
import React from 'react';

const FRAME_URL = 'http(s)://third-party-component-url';

export default function App() {
  return (
    <iframe
      src={FRAME_URL}
      style={{
        width: '100%',
        height: '600px',
      }}
    />
  );
}
```

### 与第三方系统交互

与第三方系统进行交互，我们需要可以通过 React 的 `ref` 来读取和操作第三方系统 `iframe`。

{{% notice note %}}
由于浏览器的同源策略（Same-Origin Policy），如果第三方系统网页与 KubeSphere 前端网页不同源，我们将无法使用 JavaScript 对第三方系统 `iframe` 进行读取和操作。
因此，我们通常需要由后端将第三方系统的前端访问地址，处理成和 KubeSphere 前端访问地址同源（**同协议**、**同主机**、**同端口**）的地址。
{{% /notice %}}

{{% notice note %}}
后端处理之后的地址路径，一般应在 `/api` 下，前端才能访问。
{{% /notice %}}

隐藏第三方系统页面头部的示例：

```jsx
import React, { useState, useRef } from 'react';
import { Loading, notify } from '@kubed/components';

const FRAME_URL = '/api/v1/path/third-party-component';

export default function App() {
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef();

  const onIframeLoad = () => {
    try {
      const iframeDom = iframeRef.current?.contentWindow?.document;
      if (iframeDom) {
        const headerContainer = iframeDom.querySelector('.header-container');
        if (headerContainer) {
          headerContainer.style.display = 'none';
        }
      }
    } catch (error) {
      notify.error(error.message);
    }

    setLoading(false);
  };

  return (
    <>
      {loading && <Loading className="page-loading" />}
      <iframe
        ref={iframeRef}
        src={FRAME_URL}
        style={{
          width: '100%',
          height: 'calc(100vh - 68px)',
          display: loading ? 'none' : 'block',
        }}
        onLoad={onIframeLoad}
      />
    </>
  );
}
```

有时，如果第三方系统需要登录，为了更好的用户体验，我们可能会选择将 KubeSphere 和第三方系统的登录认证打通。

如果第三方系统采用 `JWT` 之类的认证方式，且其前端将 `token` 信息存储在 `localStorage` 中。

由于二者同源，因此我们可以从后端获取到第三方系统的 `token` 信息后，将其直接存在 `localStorage` 中，具体需根据第三方系统的实际情况而定。

示例如下：

```jsx
import React, { useState } from 'react';
import { Loading } from '@kubed/components';
import { useLocalStorage } from '@kubed/hooks';

const FRAME_URL = '/api/v1/path/third-party-component';
const TOKEN_INFO = 'TOKEN_INFO';

export default function App() {
  const [loading, setLoading] = useState(true);

  const onIframeLoad = () => {
    setLoading(false);
  };

  useLocalStorage({ key: 'tokenInfo', defaultValue: TOKEN_INFO });

  return (
    <>
      {loading && <Loading className="page-loading" />}
      <iframe
        src={FRAME_URL}
        style={{
          width: '100%',
          height: 'calc(100vh - 68px)',
          display: loading ? 'none' : 'block',
        }}
        onLoad={onIframeLoad}
      />
    </>
  );
}
```
