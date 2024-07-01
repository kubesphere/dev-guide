---
title: Assign Ingress to Extensions
weight: 07
description: "Learn how to assign a separate Ingress access entry for extensions."
---

In KSE v4.1.1, the ks-core chart introduces the following configuration options to pass external ingress information to extensions, enabling the creation and usage of ingress in extension charts:

```yaml
extension:
  ingress:
    # Ingress class name of the external ingress
    ingressClassName: ""
    # Domain suffix used to create an access entry for extensions. Depending on the external ingress address, it can be the LB hostname address (e.g., xx.com), {node_ip}.nip.io, or internal DNS address (e.g., kse.local).
    domainSuffix: ""
    # HTTP port of the ingress
    httpPort: 80
    # HTTPS port of the ingress
    httpsPort: 443
```

With the above configuration, the following values will be automatically injected into the extension chart for direct usage:

```
global.extension.ingress.ingressClassName
global.extension.ingress.domainSuffix
global.extension.ingress.httpPort
global.extension.ingress.httpsPort
```

## Example

Here is an example of assigning a subdomain for external access to an API interface of an extension.

Prerequisites: An environment with an ingress controller available. In this example, the nginx ingress controller is used, and a domain name "xx.com" is assigned to the LB. Update ks-core with this information:

```
helm upgrade ... --set extension.ingress.ingressClassName=nginx --set extension.ingress.domainSuffix=xx.com
```

If required, add ingress configuration and make necessary code changes to use the ingress in the extension:

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

After packaging and updating/upgrading the extension, you can access the API using `xxapi.xx.com`. In the example above, the traffic is forwarded to a service within the extension itself. If you need to forward traffic to an external address, use a Service of type `ExternalName`. Here is an example:

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