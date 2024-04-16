---
title: 外部链接
weight: 03
description: 打开外部链接
---

本节将介绍如何在扩展组件中打开外部链接。

### 前端扩展组件开发

从 GitHub 上克隆本示例的代码，然后参照[创建 Hello World 扩展组件](../../quickstart/hello-world-extension)进行创建项目、本地开发和调试。

```bash
cd  ~/kubesphere-extensions
git clone https://github.com/kubesphere/extension-samples.git
cp -r ~/kubesphere-extensions/extension-samples/extensions-frontend/extensions/external-link ~/kubesphere-extensions/ks-console/extensions
```

接下来，将重点介绍如何在扩展组件中打开外部链接。

文件路径： `~/kubesphere-extensions/ks-console/extensions/external-link/src/App.jsx`

```jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "@kubed/components";

const LINK = "https://dev-guide.kubesphere.io/";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    window.open(LINK);
    navigate(-1, { replace: true });
  }, []);

  return <Loading className="page-loading" />;
}
```

以上代码主要完成了以下两个任务：

1. 打开外部链接。
2. 退回到之前的页面。

{{% notice note %}}
示例中打开外部链接的方式虽然可以直接打开外链，但是可能会造成之前的页面状态丢失。
{{% /notice %}}

{{% notice note %}}
也可以在 `App.jsx` 写一个 `<a href={LINK} target="_blank">open link</a>` 或者按钮来点击打开外部链接。
{{% /notice %}}

![open-external-link](./open-external-link.gif?width=1200px)
