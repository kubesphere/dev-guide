---
title: External Links
weight: 03
description: Open external links in extensions.
---

This section explains how to open external links in extensions.

### Frontend extension development

First, clone the example code from GitHub and follow the instructions in the [Create a Hello World Extension](../../quickstart/hello-world-extension) guide to create a project and perform local development and debugging.

```bash
cd ~/kubesphere-extensions
git clone https://github.com/kubesphere/extension-samples.git
cp -r ~/kubesphere-extensions/extension-samples/extensions-frontend/extensions/external-link ~/kubesphere-extensions/ks-console/extensions
```

Next, let's see how to implement opening an external link in an extension.

File path: `~/kubesphere-extensions/ks-console/extensions/external-link/src/App.jsx`

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

The above code achieves the following:

1. Open the specified external link in a new browser tab.
2. Navigate back to the previous page.

{{% notice note %}}
While the method used in the example directly opens the external link, it may result in the loss of the previous page's state.
{{% /notice %}}

{{% notice note %}}
Another approach is to use `<a href={LINK} target="_blank">Open Link</a>` in `App.jsx` or use a button to open the external link.
{{% /notice %}}

![open-external-link](./open-external-link.gif?width=1200px)
