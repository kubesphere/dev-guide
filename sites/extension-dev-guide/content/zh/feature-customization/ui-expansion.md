---
title: UI 扩展
weight: 07
description: 介绍如何扩展 UI
---

## UI 扩展

完成前端功能开发后可通过配置 **JSBundle** 这种方式将页面扩展到 KS 平台中，`ks-console` 会根据 JSBundle 中的配置自动注入该扩展包。

如下：在 default namespace 中部署了 employee-frontend 前端服务后，通过如下配置可以将该服务中的前端资源扩展到 KS 平台中。

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

对于一些 js 体积较大的文件就需要制作成镜像，部署成应用负载和服务的方式来扩展，这里 `spec.rawFrom.url` 指向服务中对应的 index.js 文件。

对于那些体积比较小的 js 文件，可以直接写在这个 CR 中，或 ConfigMap 或 Secret 中，更多配置方式见 [JSBundle](https://dev-guide.kubesphere.io/extension-dev-guide/zh/architecture/backend-extension-architecture/#jsbundle)。