---
title: 为扩展组件分配 Ingress
weight: 07
description: "介绍如何为扩展组件分配独立的 Ingress 访问入口"
---

在 4.1.1 版本中，ks-core chart 新增如下配置项，支持将外部 ingress 相关信息传递给扩展组件，以支持在扩展组件 chart 中创建和使用 ingress：

```yaml
extension:
  ingress:
    # 外部 ingress 的 ingressClassName
    ingressClassName: ""
    # 用于创建扩展组件访问入口的域名后缀。根据外部 ingress 地址，它可以是 LB 主机名地址（比如 xx.com）、{node_ip}.nip.io 或内部 DNS 地址（比如 kse.local）。
    domainSuffix: ""
    # ingress 的 http 端口
    httpPort: 80
    # ingress 的 https 端口
    httpsPort: 443
```

通过上面的配置，扩展组件 chart 中将会被自动注入如下值，可直接使用：

```
global.extension.ingress.ingressClassName
global.extension.ingress.domainSuffix
global.extension.ingress.httpPort
global.extension.ingress.httpsPort
```

## 使用示例

下面是一个示例，为一个扩展组件的 API 接口分配一个子域名以供外部访问。

前提条件是环境存在可使用的任意 ingress controller，在示例环境中使用了 nginx ingress controller，并且 LB 分配了一个域名 xx.com，根据这些信息更新 ks-core：

```
helm upgrade ... --set extension.ingress.ingressClassName=nginx --set extension.ingress.domainSuffix=xx.com
```

扩展组件增加 ingress 配置项以及一些使用 ingress 的其它代码更改（如有必要）：

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: xx-api
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: {{ .Values.global.extension.ingress.ingressClassName }}
  rules:
    - host: xxapi.{{ .Values.global.extension.ingress.domainSuffix }}
      http:
        paths:
          - pathType: Prefix
            path: "/"
            backend:
              service:
                name: xx-api-backend
                port:
                  number: 80
```

打包、更新/升级扩展组件之后即可使用 `xxapi.xx.com` 来访问 API，上述示例中将流量转发到了扩展组件自身的一个 service 上，如需要转发到一个外部地址，可使用 `ExternalName` 类型的 service，示例如下：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: ExternalName
  externalName: my.database.example.com

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: xx-api
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: {{ .Values.global.extension.ingress.ingressClassName }}
  rules:
    - host: xxapi.{{ .Values.global.extension.ingress.domainSuffix }}
      http:
        paths:
          - pathType: Prefix
            path: "/"
            backend:
              service:
                name: my-service
                port:
                  number: 80
```
