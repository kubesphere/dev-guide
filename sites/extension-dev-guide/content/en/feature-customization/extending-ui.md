---
title: UI Extensions
weight: 01
description: Describes how to extend the UI.
---

## UI Extensions

Different from the development mode, ks-console running in the production mode cannot directly load the pages you developed locally. After completing the development of the frontend function, you should package the frontend code, and use the resource statement **JSBundle** to inject your UI package into ks-console.

Example: 

```yaml
apiVersion: extensions.kubesphere.io/v1alpha1
kind: JSBundle
metadata:
   name: v1alpha1.employee.kubesphere.io
spec:
   rawFrom:
     url: http://employee-frontend.extension-employee.svc/dist/employee-frontend/index.js

   #configMapKeyRef:
   # name: example
   # key: index.js
   # namespace: extension-employee
   #secretKeyRef:
   # name: example
   # key: index.js
   # namespace: extension-employee 
```

| Field | Description |
| --- | ---|
| `spec.raw`, `spec.rawFrom.configMapKeyRef`, `spec.rawFrom.secretKeyRef` | To facilitate development, small js files can be directly defined in CR or embedded in ConfigMap or Secret. |
| `spec.rawFrom.url` | Larger js files should be provided through additional backend services. After the extension is enabled, `ks-console` will automatically inject into the extension. |

For js files that are small in size after packaging, they can be saved into ConfigMap or Secret, and reference them through `spec.configMapKeyRef`, `spec.secretKeyRef`.

For js files with a large size after packaging, they should be provided through HTTP service, and `spec.rawFrom.url` shows the path of the js files.