---
title: Customize Licenses for Extensions
weight: 08
description: Introduction on how to customize the license for extensions.
---

This section introduces how to customize the license for your extensions.

In KubeSphere Enterprise v4.x, each extension requires its own corresponding license; otherwise, the extension functionality will not be available.

The license provides basic restrictions on authorized resources and period. To support the diversity and flexibility of extensions, KubeSphere Enterprise also allows extensions to customize some restrictions within the license.


## Principles

```
-----BEGIN LICENSE-----
H4sIAAAAAAAA/2SQydKyOgOEr8hTDIKyZCZRUIYwbSwJIIlMr4IBrv4v3/+rU1/V
WfQinc5Tna5W2BQ2JhcCQ7QB3iPgDfpAwjqQwXNMYx0q/1QrHPOvQRG7GGi5RA/e
+4apzy4GYG7455GNvqCtTOCWiXDETjAWwp6c9V/vJ088DtDxADrvA+hAQt6zpFdy
lk+7WD7JeynbfeTTTgM99wZdu2ExbjEBcrVCWqxABt3EZ128YbtpcYfmTFg+ZeKT
OmSk6BTO7+KuEGH7ZbtUXT2dY+7Kba7ls0s0cN42MC8evn3mQgy0vA9++YAC5lJ/
cg00uZuGXEOV/y/tDggj99TbyiTWSv3v7Fctcg0ge5Eqe5E/e5G7dynYu5G/T75D
dt6nSLVP0cVzaUpNkfzu8yxS9dthzVPvU6aQ5mgZi6T9sw3fVFZuYAeRC0XMdbg3
6GGLBYXHndfGTsvyEMigzQ1koS+HlqnHFQLvZylsiiTm8hRu3w0qnpHy6bHyDz/9
9ncmDLqpybup+T0bJjtbjBRpu+FkwYAODzdS36kOP9iO5yJR5lxQ/uNjIW5w5w1/
M7Bd/p1bswSSexpMOGbkQtTF1Rf8/Utut1smLDwWgxa3/73DQjyXdjvn//bRlDqE
yj8ndzBZrHKSccKLDEOvDBd483n28xM774ehwIPELfcbtDOFN0u8Kn04qc6hyGkn
ti+ZUleOBrJeVyO8KLY3PwaewAhEM+DKc3ruCzlyDm/DZcptp5XDqaOGuLsSrPOv
40tX9Up6HlGdYqJ1p4djYcOlrPcya3LsnTJwUnJ2xya+VvUbyUs5nqf34uzZeJLE
T2aejaNG5btj9eimIc0SDeboR6bMYuHOoRuwG6pMKdzodBkKgG5Kc6+y4xNJ9foY
-----END LICENSE-----
```

This is a license for an extension, which is compressed and compiled before being output to the user. The user can use this license to activate a specific extension on KubeSphere Enterprise.

After importing the license into KubeSphere Enterprise, it is stored in the host cluster as a Secret. It must be stored in the `kubesphere-system` namespace and named in the format `kubesphere.license.<extension>`.


## Steps

Take the Gatekeeper license as an example to show you how to customize your extension license.

1. Run the following command to get the Secret of Gatekeeper license.

    ```shell
    root@kse:~# kubectl get  secret -n kubesphere-system kubesphere.license.gatekeeper -oyaml
    ```

    The Secret of Gatekeeper license are as follows:

    ```shell
    apiVersion: v1
    kind: Secret
    metadata:
    annotations:
        config.kubesphere.io/license-imported-by: offline
        config.kubesphere.io/license-type: subscription
    creationTimestamp: "2024-05-08T07:07:41Z"
    labels:
        config.kubesphere.io/license-id: "504769748605609140"
        config.kubesphere.io/type: license
        kubesphere.io/extension-ref: gatekeeper
    name: kubesphere.license.gatekeeper
    namespace: kubesphere-system
    resourceVersion: "904299"
    uid: bc1dfb71-123b-44f1-b9f8-0b9667693c42
    data:
    profile: Y29ycG9yYXRpb246IOa1i+ivlUtTQ+iuuOWPr+ivgQppbXBvcnRlZEF0OiAiMjAyNC0wNS0wOFQxNTowNzo0MS4wMzI4MzQwNjErMDg6MDAiCmltcG9ydGVkQnk6IG9mZmxpbmUKaXNzdWVkQXQ6ICIyMDI0LTAzLTE0VDA1OjU2OjU1LjU5NTg2OTU4OFoiCmxpY2Vuc2VUeXBlOiBzdWJzY3JpcHRpb24Kbm90QWZ0ZXI6ICIyMDI0LTA2LTA4VDE5OjAwOjAwWiIKbm90QmVmb3JlOiAiMjAyNC0wMi0yNVQwOTo0NzowNVoiCnJlc291cmNlVHlwZTogVkNQVQo=
    raw: ZXlKaGJHY2lPaUpTVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBaQ0k2SWpVd05EYzJPVGMwT0RZd05UWXdPVEUwTUNJc0luUjVjR1VpT2lKemRXSnpZM0pwY0hScGIyNGlMQ0p6ZFdKcVpXTjBJanA3SW1Odklqb2k1cldMNkstVlMxTkQ2SzY0NVktdjZLLUJJbjBzSW1semMzVmxjaUk2ZXlKamJ5STZJbXQxWW1WemNHaGxjbVV1WTJ4dmRXUWlmU3dpYm05MFFtVm1iM0psSWpvaU1qQXlOQzB3TWkweU5WUXdPVG8wTnpvd05Wb2lMQ0p1YjNSQlpuUmxjaUk2SWpJd01qUXRNRFl0TURoVU1UazZNREE2TURCYUlpd2lhWE56ZFdWQmRDSTZJakl3TWpRdE1ETXRNVFJVTURVNk5UWTZOVFV1TlRrMU9EWTVOVGc0V2lJc0ltTnZiWEJ2Ym1WdWRFNWhiV1VpT2lKbllYUmxhMlZsY0dWeUlpd2ljbVZ6YjNWeVkyVk1hVzFwZENJNmV5SnRZWGhXUTNCMUlqb3lNREI5TENKeVpYTnZkWEpqWlZSNWNHVWlPaUpXUTFCVkluMC5lNnFhODBUdC1ocnQ1Qk11NGlsd1lpa3pqVXZwc1l2LU1US3lwQ2hxME1VZWp1VDI1dXBfaElmcjZTMF9UV0s5dTBRNnpqQURIbTdwRmpCOUlTR2hpRHIwTzQzaGJac2RIaDRfbkNON3prNUR2Q1VQZkRvVGxuXzdlNm0zWkdMcDdUcF9EOWhVcmVveTl4bWJ1TGtQNFA1OGxGZUhmT1NmOHpUT2RDX2hvWXlmc202amhBQWlaWWtxVzlmWXNzQm9QeWxSSWhiaVhocUJlOHVEWHBLLXEyT292emhYMDVEM0ppZm9wQnhtUUg0Q3JKbkNIZTh0dlVHYTZRak41d290RVd4SGJZdktLZVdldU1wMFlnb2QtdzI4QjItQkFtejgxbjYxdWk4Ym1JR2d1MHF4VkZ6UW8ycm03QTZMQkhpRW1ueW02SUlUVms1VEFmUXlHR3l3UkNSakNtMHZWOHpjanNaU0Ewdm1hdmxGWGdmVFJWc296c05feHRaVnZXaE1qUldWam9CMTBIZjE1RUdMcVlzVG9hTkU2alFGRU1ncDdnMmd2blpZMktGR2RqSkJHWjUwZEhPNWhHVjE2UkVSVUhyLWV3RlZzZzNOVmNRYTRYY3ZhSC1oQjNPSU9GX0xtX25Hc3hkbFZzOWtKUjVCazlWQ1J5NU1LQ0dUWW05dXlSSUlNNDNtZDczWjQySV9EaEFkcjU2OExUQmxuWkZJN3BOZ0dzNWJiMDNEWkZtZTdpYnF1NFFtOU9QdjktbzdTTHJaMFcxdU9LOU5MZ0N1UHpDTWZDZmJrdTZ3dGppQzZzUXhmdDZjWkYtQWJicHR6cnN5bGVEczFhYWtUWDJ3
    violation: Y3VycmVudDogNApleHBlY3RlZDogMjAwCnR5cGU6IE5vIHZpb2xhdGlvbgp1cGRhdGVkQXQ6ICIyMDI0LTA1LTEzVDE1OjUxOjA5LjQ4MDYzMyswODowMCIK
    type: config.kubesphere.io/license
    ```

2. Get the raw data of the license, i.e., the `data.raw` field of the license secret, as shown below:

    ```
    ZXlKaGJHY2lPaUpTVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBaQ0k2SWpVd05EYzJPVGMwT0RZd05UWXdPVEUwTUNJc0luUjVjR1VpT2lKemRXSnpZM0pwY0hScGIyNGlMQ0p6ZFdKcVpXTjBJanA3SW1Odklqb2k1cldMNkstVlMxTkQ2SzY0NVktdjZLLUJJbjBzSW1semMzVmxjaUk2ZXlKamJ5STZJbXQxWW1WemNHaGxjbVV1WTJ4dmRXUWlmU3dpYm05MFFtVm1iM0psSWpvaU1qQXlOQzB3TWkweU5WUXdPVG8wTnpvd05Wb2lMQ0p1YjNSQlpuUmxjaUk2SWpJd01qUXRNRFl0TURoVU1UazZNREE2TURCYUlpd2lhWE56ZFdWQmRDSTZJakl3TWpRdE1ETXRNVFJVTURVNk5UWTZOVFV1TlRrMU9EWTVOVGc0V2lJc0ltTnZiWEJ2Ym1WdWRFNWhiV1VpT2lKbllYUmxhMlZsY0dWeUlpd2ljbVZ6YjNWeVkyVk1hVzFwZENJNmV5SnRZWGhXUTNCMUlqb3lNREI5TENKeVpYTnZkWEpqWlZSNWNHVWlPaUpXUTFCVkluMC5lNnFhODBUdC1ocnQ1Qk11NGlsd1lpa3pqVXZwc1l2LU1US3lwQ2hxME1VZWp1VDI1dXBfaElmcjZTMF9UV0s5dTBRNnpqQURIbTdwRmpCOUlTR2hpRHIwTzQzaGJac2RIaDRfbkNON3prNUR2Q1VQZkRvVGxuXzdlNm0zWkdMcDdUcF9EOWhVcmVveTl4bWJ1TGtQNFA1OGxGZUhmT1NmOHpUT2RDX2hvWXlmc202amhBQWlaWWtxVzlmWXNzQm9QeWxSSWhiaVhocUJlOHVEWHBLLXEyT292emhYMDVEM0ppZm9wQnhtUUg0Q3JKbkNIZTh0dlVHYTZRak41d290RVd4SGJZdktLZVdldU1wMFlnb2QtdzI4QjItQkFtejgxbjYxdWk4Ym1JR2d1MHF4VkZ6UW8ycm03QTZMQkhpRW1ueW02SUlUVms1VEFmUXlHR3l3UkNSakNtMHZWOHpjanNaU0Ewdm1hdmxGWGdmVFJWc296c05feHRaVnZXaE1qUldWam9CMTBIZjE1RUdMcVlzVG9hTkU2alFGRU1ncDdnMmd2blpZMktGR2RqSkJHWjUwZEhPNWhHVjE2UkVSVUhyLWV3RlZzZzNOVmNRYTRYY3ZhSC1oQjNPSU9GX0xtX25Hc3hkbFZzOWtKUjVCazlWQ1J5NU1LQ0dUWW05dXlSSUlNNDNtZDczWjQySV9EaEFkcjU2OExUQmxuWkZJN3BOZ0dzNWJiMDNEWkZtZTdpYnF1NFFtOU9QdjktbzdTTHJaMFcxdU9LOU5MZ0N1UHpDTWZDZmJrdTZ3dGppQzZzUXhmdDZjWkYtQWJicHR6cnN5bGVEczFhYWtUWDJ3
    ```

3. Parse the raw data of the license using the code [here](https://gist.github.com/zhou1203/761aab16a9e0b4c18ac65cec10b4819e), convert it to JSON, and export it as follows:

    ```json
    {"id":"504769748605609140","type":"subscription","subject":{"co":"测试KSC许可证"},"issuer":{"co":"kubesphere.cloud"},"notBefore":"2024-02-25T09:47:05Z","notAfter":"2024-06-08T19:00:00Z","issueAt":"2024-03-14T05:56:55.595869588Z","componentName":"gatekeeper","resourceLimit":{"maxVCpu":200},"resourceType":"VCPU"}
    ```

4. Customize the fields for your extension license.

    ```json
    {
    "id": "508519857256408201",
    "type": "subscription",
    "subject": {
        "co": "KSE测试许可证"
    },
    "issuer": {
        "co": "kubesphere.cloud"
    },
    "notBefore": "2024-03-30T09:47:05Z",
    "notAfter": "2024-05-30T00:00:00Z",
    "issueAt": "2024-04-09T02:50:54.538228148Z",
    "componentName": "springcloud",
    "resourceLimit": {
        "maxVCpu": 500
    },
    "resourceType": "VCPU"
    }
    ```

    The string above contains the basic limitations of this license for the KubeSphere cluster. If additional restrictions need to be added, you can use the `customParameters` field to store extra information. You must pre-define `customParameters` as a **JSON escaped string**, and then configure the `customParameters` field in the generated license.

    For example, RadonDB DMP sets the `customParameters` field in its license to limit the number of database instances in the platform, as shown below:

    ```json
    "{\"vCpuLimit\": {\"kafka\": 10,\"mysql\": 10,\"openmongo\": 10,\"opensearch\": 10,\"pg\": 10,\"rabbitmq\": 10,\"rediscluster\": 10,\"redissentinel\": 10}}"
    ```

    ```json
    {
    "id": "508519857256408202",
    "type": "subscription",
    "subject": {
        "co": "KSE测试许可证"
    },
    "issuer": {
        "co": "kubesphere.cloud"
    },
    "notBefore": "2024-03-30T09:47:05Z",
    "notAfter": "2024-05-30T00:00:00Z",
    "issueAt": "2024-04-09T02:50:54.538228148Z",
    "componentName": "dmp",
    "resourceLimit": {
        "maxVCpu": 500
    },
    "resourceType": "VCPU",
    "customParameters": "{\"vCpuLimit\": {\"kafka\": 10,\"mysql\": 10,\"openmongo\": 10,\"opensearch\": 10,\"pg\": 10,\"rabbitmq\": 10,\"rediscluster\": 10,\"redissentinel\": 10}}"
    }
    ```

    After obtaining the parsed license, the extension will implement the restriction logic based on the parameters in `customParameters`.