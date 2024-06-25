---
title: 外部链接
weight: 03
description: 如何在扩展组件中打开外部链接
---

本节介绍如何在扩展组件中打开外部链接。

### 前端扩展组件开发

首先，从 GitHub 克隆示例代码，并根据 [创建 Hello World 扩展组件](../../quickstart/hello-world-extension) 的指导文档，进行项目创建、本地开发及调试。

```bash
cd ~/kubesphere-extensions
git clone https://github.com/kubesphere/extension-samples.git
cp -r ~/kubesphere-extensions/extension-samples/extensions-frontend/extensions/external-link ~/kubesphere-extensions/ks-console/extensions
```

接下来详细介绍如何在扩展组件中实现打开外部链接。

文件路径：`~/kubesphere-extensions/ks-console/extensions/external-link/src/App.jsx`

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

以上代码实现以下功能：

1. 在浏览器的新标签页打开指定的外部链接。
2. 返回到之前的页面路径。

{{% notice note %}}
虽然示例中使用的方法可以直接打开外部链接，但可能会导致之前页面的状态丢失。
{{% /notice %}}

{{% notice note %}}
另一种方法是在 `App.jsx` 中使用 `<a href={LINK} target="_blank">Open Link</a>` 或者通过按钮来打开外部链接。
{{% /notice %}}

![open-external-link](./open-external-link.gif?width=1200px)
