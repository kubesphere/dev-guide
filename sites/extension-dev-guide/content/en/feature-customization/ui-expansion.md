---
title: Extend UI components
weight: 07
description: Describe how to extend UI components.
---

This section describes how to extend UI components.

After you have developed front-end functionalities, you can configure **JSBundle** to extend the UI components to KubeSphere, and then `ks-console` will automatically inject the extension package.

For example, in the default namespace, you deploy the employee-frontend, and then you can refer to the following to extend UI components to KubeSphere.

```yaml
apiVersion: extensions.kubesphere.io/v1alpha1
kind: JSBundle
metadata:
  name: v1alpha1.employee.kubesphere.io
spec:
  rawFrom:
    url: http://employee-frontend.default.svc/dist/employee-frontend/index.js

  # configMapKeyRef:
  #   name: example
  #   key: index.js
  #   namespace: example-system

  # secretKeyRef:
  #   name: example
  #   key: index.js
  #   namespace: example-system

# filenameOverride: "index.js"
# raw: ""
```

For some large-size JavaScript files, you can pack them as images and deploy them as a workload or service. In the example, the value of `spec.rawFrom.url` should be the path where **index.js** resides.

For some small-size JavaScript files, you can configure then in CR, ConfigMap, or Secret. For more information, refer to [JSBundle](https://dev-guide.kubesphere.io/extension-dev-guide/en/architecture/backend-extension-architecture/).
