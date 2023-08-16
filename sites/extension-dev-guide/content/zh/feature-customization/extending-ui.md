---
title: UI 扩展
weight: 01
description: 介绍如何扩展 UI
---

## UI 扩展

有别于开发模式，以 production 模式运行的 ks-console 无法从本地直接加载您开发的功能页面，在完成前端功能开发后，需要将前端代码打包，再创建 **JSBundle** 这种自定义资源，将您的 UI 扩展包注入到 ks-console 之中。

示例：在 default namespace 中部署了 employee-frontend 前端服务后，通过如下配置可以将打包好的前端扩展包注入到 ks-console 中。

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
```

对于打包之后体积比较小的 js 文件，我们可以借助 ConfigMap 或 Secret 中来保存，通过 `spec.configMapKeyRef`、`spec.secretKeyRef` 进行引用。

对于打包之后体积较大的 js 文件，则需要通过 HTTP 服务来提供对应的 js 文件，`spec.rawFrom.url` 指向 js 文件的访问路径。

更多配置方式见 [JSBundle](https://dev-guide.kubesphere.io/extension-dev-guide/zh/architecture/backend-extension-architecture/#jsbundle)。
