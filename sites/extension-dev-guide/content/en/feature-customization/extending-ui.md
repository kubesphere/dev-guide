---
title: UI Extensions
weight: 01
description: Describes how to extend the UI.
---

## UI Extensions

Different from the development mode, ks-console runs in the production mode and cannot directly load the pages you developed locally. After completing the development of the frontend function, you should package the frontend code, and create a custom resource like **JSBundle** to inject your UI package into ks-console.

Example: After the frontend service `employee-frontend` is deployed in the default namespace, the packaged frontend package can be injected into ks-console by the following configuration.

```yaml
apiVersion: extensions.kubesphere.io/v1alpha1
kind: JSBundle
metadata:
   name: v1alpha1.employee.kubesphere.io
spec:
   rawFrom:
     url: http://employee-frontend.default.svc/dist/employee-frontend/index.js

   #configMapKeyRef:
   # name: example
   # key: index.js
   # namespace: example-system

   #secretKeyRef:
   # name: example
   # key: index.js
   # namespace: example-system

   # filenameOverride: "index.js"
```

For js files that are small in size after packaging, they can be saved as ConfigMap or Secret, and reference them through `spec.configMapKeyRef`, `spec.secretKeyRef`.

For js files with a large size after packaging, they should be provided through HTTP service, and `spec.rawFrom.url` shows the path of the js files.

For more configuration methods, see [JSBundle](https://dev-guide.kubesphere.io/extension-dev-guide/en/architecture/backend-extension-architecture/#jsbundle).