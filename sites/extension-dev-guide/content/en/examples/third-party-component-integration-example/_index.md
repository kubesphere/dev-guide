---
title: Weave Scope
weight: 2
description: Integrate with third-party tools and systems that have existing web UIs.
---

This section provides an example of integrating Weave Scope into extensions to help you familiarize how to quickly integrate third-party tools and systems with existing web UIs.

[Weave Scope](https://github.com/weaveworks/scope) automatically generates a map of your application, enabling you to intuitively understand, monitor, and control your containerized, microservices-based application.

### Deploy Weave Scope

To deploy Weave Scope, view the related content in [Deploy Weave Scope](https://www.weave.works/docs/scope/latest/installing), or run the following command to deploy it to a Kubernetes cluster:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubesphere/extension-samples/master/extensions-backend/weave-scope/manifests.yaml
```

### Create a reverse proxy for Weave Scope

```bash
kubectl apply -f https://raw.githubusercontent.com/kubesphere/extension-samples/master/extensions-backend/weave-scope/weave-scope-reverse-proxy.yaml
```

### Develop frontend extensions

Clone the code of this example from GitHub, and then refer to [Create a Hello World Extension](../../quickstart/hello-world-extension) for project creation, local development and debugging.

```bash
cd  ~/kubesphere-extensions
git clone https://github.com/kubesphere/extension-samples.git
cp -r ~/kubesphere-extensions/extension-samples/extensions-frontend/extensions/weave-scope ~/kubesphere-extensions/ks-console/extensions
```

The following code block shows how to integrate Weave Scope:

File path: `~/kubesphere-extensions/ks-console/extensions/weave-scope/src/App.jsx`

```jsx
import React, { useState, useRef } from 'react';
import { get } from 'lodash';
import { Loading } from '@kubed/components';
import { useLocalStorage } from '@kubed/hooks';

export default function App() {
  const [loading, setLoading] = useState(true);

  const FRAME_URL =
    '/proxy/weave.works/#!/state/{"topologyId":"pods"}';

  const iframeRef = useRef();

  const onIframeLoad = () => {
    const iframeDom = get(iframeRef.current, 'contentWindow.document');
    if (iframeDom) {
      if (iframeDom.querySelector('#app > div > div.header > div')) {
        iframeDom.querySelector('#app > div > div.header > div').style.display = 'none';
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

The preceding code block completes the following tasks:

1. Use `iframe` to integrate Weave Scope into extensions. `FRAME_URL` is the reverse proxy of Weave Scope, which shares the **origin** with the KubeSphere web console.

{{% notice note %}}
Due to the Same-Origin Policy, if the third-party system webpage has a different origin from the KubeSphere frontend, KubeSphere cannot use JavaScript to read and operate on the third-party system iframe. Therefore, it requires the backend to process the frontend address of the third-party system as the same source as the KubeSphere frontend (**same protocol**, **host**, and **port**).
{{% /notice %}}

2. Adjust the webpage style of Weave Scope. Due to the same origin, the extension can read and operate on the Document Object Model (DOM) of the Weave Scope page (`iframe`) by using `React` `ref`. This way, you can adjust the style and hide the effect caused by the selector.

Run `yarn dev` to launch a local environment, and then access the webpage through the extension:

![weave-scope-dashboard](./sample-weave-scope-dashboard.png)