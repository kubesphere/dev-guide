---
title: 第三方系统集成示例
weight: 02
description: 快速集成已有 Web UI 的第三方工具与系统
---

本章以将 Nacos 集成到扩展组件为例，带大家熟悉如何快速集成已有 Web UI 的第三方工具与系统。

Nacos 是一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。

## 前端扩展组件开发

项目的创建、本地开发、构建、部署、注册等流程，除了由于扩展组件的名称导致的不同以外，其他均与[员工管理扩展组件示例](zh/examples/employee-management-extension-example/#前端扩展组件开发)相同。

我们着重来看一下如何将 Nacos 的页面集成进来。

我们将下面的代码复制粘贴到某个前端扩展组件目录下的 `src/App.jsx` 中，便可以完成集成。

```jsx
import React, { useState, useRef } from 'react';
import { get } from 'lodash';
import { Loading } from '@kubed/components';
import { useLocalStorage } from '@kubed/hooks';

export default function App() {
  const [loading, setLoading] = useState(true);

  const FRAME_URL =
    '/api/v1/namespaces/nacos-system/services/nacos-cs:http/proxy/nacos/index.html';
  const TOKEN_INFO = {
    accessToken:
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYWNvcyIsImV4cCI6MTY1Mjc4ODI2NX0.i5xDBKW8WR_QB8VmHE62SB0TUYvlkK02KprpvSom8rY',
    tokenTtl: 18000,
    globalAdmin: true,
    username: 'nacos',
  };
  useLocalStorage({ key: 'token', defaultValue: JSON.stringify(TOKEN_INFO) });

  const iframeRef = useRef();

  const onIframeLoad = () => {
    const iframeDom = get(iframeRef.current, 'contentWindow.document');
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
        width="100%"
        height="100%"
        frameBorder="0"
        style={{
          height: 'calc(100vh - 68px)',
          display: loading ? 'none' : 'block',
        }}
        onLoad={onIframeLoad}
      />
    </>
  );
}
```

以上代码主要做了 3 件事。

1. 将 Nacos 页面以 `iframe` 的形式嵌入到扩展组件中。`FRAME_URL` 为后端处理过的 Nacos 页面地址，且与 KubeSphere 页面地址**同源**。

{{% notice note %}}
由于浏览器的同源策略（Same-Origin Policy），如果第三方系统网页与 KubeSphere 前端网页不同源，我们将无法使用 JavaScript 对第三方系统 iframe 进行读取和操作。 因此，我们通常需要由后端将第三方系统的前端访问地址，处理成和 KubeSphere 前端访问地址同源（**同协议**、**同主机**、**同端口**）的地址。
{{% /notice %}}

{{% notice note %}}
`FRAME_URL` 一般应在 /api 下，前端才能访问。
{{% /notice %}}

2. 将 Nacos 的 `token` 认证信息存到 KubeSphere 页面的 `localStorage` 中。`TOKEN_INFO` 为后端处理过的 Nacos `token` 信息。由于 Nacos 页面地址与 KubeSphere 页面地址同源，因此 Nacos 页面也可以从 `localStorage` 中读取到自身的 `token` 信息，从而登录。

3. 调整 Nacos 页面的样式。同样由于是同源，扩展组件可以通过 `React` 的 `ref` 读取和操作 Nacos 页面（`iframe`）的 DOM ，从而调整 Nacos 页面的样式，将其头部隐藏。
