---
title: KubeSphere API reference
weight: 04
description:  KubeSphere API
---

开发扩展组件时，如果需要调用 KubeSphere LuBan 中的 API，请查看 [KubeSphere Enterprise API Docs](https://docs.kubesphere.com.cn/reference/api/v4.0.0/introduction/)。

#### 1. ServiceAccount

> 在 KubeSphere 中，ServiceAccount（服务账号）为运行在 Pod 中的进程提供身份。默认情况下，Pod 不挂载 KubeSphere ServiceAccount，但可以创建自定义 ServiceAccount 以赋予不同的权限。 ServiceAccount 用于通过 KubeSphere API 进行身份验证、访问/管理KubeSphere API、以及通过角色访问控制（RBAC）配置访问权限。可以在 Pod 中的 annotations 字段中指定 `kubesphere.io/serviceaccount-name: ServiceAccount`。


##### 1.1 创建ServiceAccount
```shell
cat <<EOF | kubectl apply -f -
apiVersion: kubesphere.io/v1alpha1
kind: ServiceAccount
metadata:
  name: sample
  namespace: default
secrets: []
EOF
```
> 查看ServiceAccount
```shell
[root@ks ~]# kubectl get serviceaccounts.kubesphere.io -n default
NAME     AGE
sample   28s

[root@ks ~]# kubectl get serviceaccounts.kubesphere.io sample -n default -o jsonpath={.secrets[].name}
sample-lqmbj

# 查看 ServiceAccount 绑定的 Secrets
[root@ks ~]# kubectl get secrets $(kubectl get serviceaccounts.kubesphere.io sample -n default -o jsonpath={.secrets[].name}) -n default
NAME           TYPE                                  DATA   AGE
sample-lqmbj   kubesphere.io/service-account-token   1      3m8s

# 获取 ServiceAccount 绑定 Secrets 中保存的 Token 
[root@ks ~]# kubectl get secrets $(kubectl get serviceaccounts.kubesphere.io sample -n default -o jsonpath={.secrets[].name}) -n default -o jsonpath={.data.token} | base64 -d
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8va3MtY29uc29sZS5rdWJlc3BoZXJlLXN5c3RlbS5zdmM6MzA4ODAiLCJzdWIiOiJrdWJlc3BoZXJlOnNlcnZpY2VhY2NvdW50OmRlZmF1bHQ6c2FtcGxlIiwiaWF0IjoxNzIxMzI0MTY2LCJ0b2tlbl90eXBlIjoic3RhdGljX3Rva2VuIiwidXNlcm5hbWUiOiJrdWJlc3BoZXJlOnNlcnZpY2VhY2NvdW50OmRlZmF1bHQ6c2FtcGxlIn0.jmJq-va5mQGwtWnM8t8Z2aFsCG2yPCFhCzPu8YuGBss
```
##### 1.2 使用 ServiceAccount
> 在 Pod 中使用 ServiceAccount

**在** `metadata.annotations` **中设置** `kubesphere.io/serviceaccount-name: <name>`
```shell
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  annotations:
    kubesphere.io/creator: admin
    kubesphere.io/imagepullsecrets: '{}'
    kubesphere.io/serviceaccount-name: sample   # <----- 设置 ServiceAccount
  name: sample-pod
  namespace: default
spec:
  containers:
  - image: nginx
    imagePullPolicy: IfNotPresent
    name: container-5tkfmj
    ports:
    - containerPort: 80
      name: http-80
      protocol: TCP
    resources: {}
EOF
```
**查看 Pod 的yaml资源清单**
> 注意：ServiceAccount 会被自动注入到 Pod 的资源清单中，ServiceAccount 中的 Secrets 会自动挂载到 `/var/run/secrets/kubesphere.io/serviceaccount` 目录下
```text
spec:
  containers:
  - image: nginx
    imagePullPolicy: IfNotPresent
    name: container-5tkfmj
   ...
    volumeMounts:
    - mountPath: /var/run/secrets/kubesphere.io/serviceaccount
      name: kubesphere-service-account
      readOnly: true
  ...
  volumes:
    - name: kubesphere-service-account
      projected:
        defaultMode: 420
        sources:
        - secret:
            items:
            - key: token
              path: token
            name: sample-lqmbj

```

> 在 Deployment 中使用 ServiceAccount

**在** `spec.template.metadata.annotations` **中设置** `kubesphere.io/serviceaccount-name: <name>`
```shell
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: sample-deploy
  name: sample-deploy
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: sample-deploy
  template:
    metadata:
      annotations:
        kubesphere.io/creator: admin
        kubesphere.io/imagepullsecrets: '{}'
        kubesphere.io/serviceaccount-name: sample       # <----- 设置 ServiceAccount
      labels:
        app: sample-deploy
    spec:
      containers:
      - image: nginx
        imagePullPolicy: IfNotPresent
        name: nginx
        ports:
        - containerPort: 80
          name: http-80
          protocol: TCP
        resources: {}
EOF
```
> 同理，KubeSphere 会根据 `kubesphere.io/serviceaccount-name` 这个 annotation 自动注入 ServiceAccount，并将 ServiceAccount 中生成的 Secrets 挂载到 `/var/run/secrets/kubesphere.io/serviceaccount` 目录下

##### 1.3 使用 ServiceAccount 访问 KubeSphere API
> 使用 KubeSphere Go SDK `kubesphere.io/client-go` 访问 KubeSphere API
```go
package main

import (
	"context"
	"fmt"

	v1 "k8s.io/api/core/v1"

	"kubesphere.io/client-go/kubesphere/scheme"
	"kubesphere.io/client-go/rest"
)

func main() {
	config, err := rest.InClusterConfig()
	if err != nil {
		fmt.Println(err)
	}
	if err = rest.SetKubeSphereDefaults(config); err != nil {
		fmt.Println(err)
	}
	config.GroupVersion = &v1.SchemeGroupVersion
	config.NegotiatedSerializer = scheme.Codecs.WithoutConversion()

	c, err := rest.RESTClientFor(config)

	if err != nil {
		fmt.Println(err)
	}
    
	// 可访问 KubeSphere API，但是显示权限不够
	resp, err := c.Get().AbsPath("/kapis/tenant.kubesphere.io/v1beta1/clusters").Do(context.Background()).Raw()
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println(string(resp))
	}
}
```
> 使用 ServiceAccount Token 访问 KubeSphere API
```shell
token=$(kubectl get secrets $(kubectl get serviceaccounts.kubesphere.io sample -n default -o jsonpath={.secrets[].name}) -n default -o jsonpath={.data.token} | base64 -d)

[root@ks ~]# kubectl get svc ks-apiserver -n kubesphere-system -o jsonpath={.spec.clusterIP}
10.233.56.50

[root@ks ~]# curl --location 'http://10.233.56.50:80/kapis/tenant.kubesphere.io/v1beta1/clusters' \
--header 'Accept: application/json, text/plain, */*' \
--header "Authorization: Bearer $token"

# 可访问 KubeSphere API 但是显示权限不够
{
  "kind": "Status",
  "apiVersion": "v1",
  "metadata": {},
  "status": "Failure",
  "message": "clusters.tenant.kubesphere.io is forbidden: User \"kubesphere:serviceaccount:default:sample\" cannot list resource \"clusters\" in API group \"tenant.kubesphere.io\" at the cluster scope",
  "reason": "Forbidden",
  "details": {
    "group": "tenant.kubesphere.io",
    "kind": "clusters"
  },
  "code": 403
}
```

##### 1.4 ServiceAccount 授权
> GlobalRole 授权
```shell
cat <<EOF | kubectl apply -f -
apiVersion: iam.kubesphere.io/v1beta1
kind: GlobalRoleBinding
metadata:
  labels:
    iam.kubesphere.io/role-ref: platform-admin
  name: sample-platform-admin
roleRef:
  apiGroup: iam.kubesphere.io
  kind: GlobalRole
  name: platform-admin
subjects:
- apiGroup: kubesphere.io
  kind: ServiceAccount
  name: sample
  namespace: default
EOF
```
> ClusterRole 授权
```shell
cat <<EOF | kubectl apply -f -
apiVersion: iam.kubesphere.io/v1beta1
kind: ClusterRoleBinding
metadata:
  labels:
    iam.kubesphere.io/role-ref: cluster-admin
  name: sample-cluster-admin
roleRef:
  apiGroup: iam.kubesphere.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- apiGroup: kubesphere.io
  kind: ServiceAccount
  name: sample
  namespace: default
EOF
```
> Role 授权
```shell
cat <<EOF | kubectl apply -f -
apiVersion: iam.kubesphere.io/v1beta1
kind: Role
metadata:
  annotations:
    kubesphere.io/creator: system
    kubesphere.io/description: '{"zh": "管理项目中的所有资源。", "en": "Manage all resources
      in the project."}'
  name: admin
  namespace: default
rules:
- apiGroups:
  - '*'
  resources:
  - '*'
  verbs:
  - '*'

---
apiVersion: iam.kubesphere.io/v1beta1
kind: RoleBinding
metadata:
  labels:
    iam.kubesphere.io/role-ref: admin
  name: sample-admin
  namespace: default
roleRef:
  apiGroup: iam.kubesphere.io
  kind: Role
  name: admin
subjects:
- apiGroup: kubesphere.io
  kind: ServiceAccount
  name: sample
  namespace: default
EOF
```
> WorkspaceRole 授权
```shell
cat <<EOF | kubectl apply -f -
apiVersion: iam.kubesphere.io/v1beta1
kind: WorkspaceRoleBinding
metadata:
  labels:
    iam.kubesphere.io/role-ref: system-workspace-admin
    kubesphere.io/workspace: system-workspace
  name: sample-admin
roleRef:
  apiGroup: iam.kubesphere.io
  kind: WorkspaceRole
  name: system-workspace-admin
subjects:
- apiGroup: kubesphere.io
  kind: ServiceAccount
  name: sample
  namespace: default
EOF
```