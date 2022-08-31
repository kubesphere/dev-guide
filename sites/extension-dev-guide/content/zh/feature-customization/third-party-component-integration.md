---
title: 第三方系统集成
weight: 07
description: 快速集成已有 Web UI 的第三方工具与系统
---

## 前端集成

KubeSphere 4.0 以 iframe 的形式，将已有 Web UI 的第三方工具与系统集成进来。

### 嵌入 iframe

我们可以在扩展组件的 `src/App.jsx` 文件或者任意 React 组件中，嵌入 `iframe`。

```javascript
import React from 'react';

const FRAME_URL = 'http(s)://third-party-component-url'; // example

export default function App() {
  return (
    <iframe
      src={FRAME_URL}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
}
```

### 与第三方系统交互

与第三方系统进行交互，我们需要可以使用 JavaScript 读取和操作其 `iframe`。

{{% notice note %}}
由于浏览器的同源策略（Same-Origin Policy），如果第三方系统网页与 KubeSphere 前端网页不同源，我们将无法对第三方系统的 `iframe` 进行读取和操作。
因此，我们通常需要由后端将第三方系统的前端访问地址，处理成和 KubeSphere 前端访问地址同源的地址。
{{% /notice %}}

{{% notice note %}}
后端处理之后的地址路径，一般应在 `/api` 下，前端才能访问。
{{% /notice %}}

```javascript
import React, { useState, useRef } from 'react';
import { Loading } from '@kubed/components';

const FRAME_URL = '/api/v1/path/third-party-component'; // example

export default function App() {
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef();

  const onIframeLoad = () => {
    const iframeDom = iframeRef.current?.contentWindow?.document;
    if (iframeDom) {
      if (iframeDom.querySelector('.header-container')) {
        iframeDom.querySelector('.header-container').style.display = 'none';
      }
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
