---
title: KubeSphere API Reference
weight: 4
description: KubeSphere API
---

When developing extensions, if you need to make API calls in KubeSphere LuBan, check it in [KubeSphere API Docs](https://docs.kubesphere.com.cn/reference/api/v4.0.0/introduction/).

#### 1. ServiceAccount

> In KubeSphere, ServiceAccount provides identity for processes running in Pods. By default, Pods do not mount KubeSphere ServiceAccount, but custom ServiceAccounts can be created to grant different permissions. ServiceAccounts are used for authenticating with the KubeSphere API, accessing/managing the KubeSphere API, and configuring access permissions through Role-Based Access Control (RBAC). You can specify `kubesphere.io/serviceaccount-name: ServiceAccount` in the annotations field of a Pod.

##### 1.1 Create a ServiceAccount

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

> View the ServiceAccount.

```shell
[root@ks ~]# kubectl get serviceaccounts.kubesphere.io -n default
NAME     AGE
sample   28s

[root@ks ~]# kubectl get serviceaccounts.kubesphere.io sample -n default -o jsonpath={.secrets[].name}
sample-lqmbj

# View the Secrets bound to the ServiceAccount
[root@ks ~]# kubectl get secrets $(kubectl get serviceaccounts.kubesphere.io sample -n default -o jsonpath={.secrets[].name}) -n default
NAME           TYPE                                  DATA   AGE
sample-lqmbj   kubesphere.io/service-account-token   1      3m8s

# Retrieve the Token saved in the Secrets bound to the ServiceAccount
[root@ks ~]# kubectl get secrets $(kubectl get serviceaccounts.kubesphere.io sample -n default -o jsonpath={.secrets[].name}) -n default -o jsonpath={.data.token} | base64 -d
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8va3MtY29uc29sZS5rdWJlc3BoZXJlLXN5c3RlbS5zdmM6MzA4ODAiLCJzdWIiOiJrdWJlc3BoZXJlOnNlcnZpY2VhY2NvdW50OmRlZmF1bHQ6c2FtcGxlIiwiaWF0IjoxNzIxMzI0MTY2LCJ0b2tlbl90eXBlIjoic3RhdGljX3Rva2VuIiwidXNlcm5hbWUiOiJrdWJlc3BoZXJlOnNlcnZpY2VhY2NvdW50OmRlZmF1bHQ6c2FtcGxlIn0.jmJq-va5mQGwtWnM8t8Z2aFsCG2yPCFhCzPu8YuGBss
```

##### 1.2 Use the ServiceAccount

> Use the ServiceAccount in a Pod.

Set `kubesphere.io/serviceaccount-name: <name>` in `metadata.annotations`.

```shell
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  annotations:
    kubesphere.io/creator: admin
    kubesphere.io/imagepullsecrets: '{}'
    kubesphere.io/serviceaccount-name: sample   # <----- Set the ServiceAccount
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

**View the YAML resource manifest of the Pod**

> Note: The ServiceAccount will be automatically injected into the Pod's resource manifest, and the Secrets of the ServiceAccount will be automatically mounted at `/var/run/secrets/kubesphere.io/serviceaccount` directory

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

> Use the ServiceAccount in a Deployment.

Set `kubesphere.io/serviceaccount-name: <name>` in `spec.template.metadata.annotations`.

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
        kubesphere.io/serviceaccount-name: sample       # <----- Set the ServiceAccount
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
> Similarly, KubeSphere will automatically inject the ServiceAccount based on the `kubesphere.io/serviceaccount-name` annotation and mount the Secrets generated in the ServiceAccount to the `/var/run/secrets/kubesphere.io/serviceaccount` directory.

##### 1.3 Access the KubeSphere API using ServiceAccount

> Access the KubeSphere API using the KubeSphere Go SDK `kubesphere.io/client-go`.

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

// Able to access the KubeSphere API, but receiving insufficient permissions error.
	resp, err := c.Get().AbsPath("/kapis/tenant.kubesphere.io/v1beta1/clusters").Do(context.Background()).Raw()
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println(string(resp))
	}
}
```

> Access the KubeSphere API using the ServiceAccount Token.

```shell
token=$(kubectl get secrets $(kubectl get serviceaccounts.kubesphere.io sample -n default -o jsonpath={.secrets[].name}) -n default -o jsonpath={.data.token} | base64 -d)

[root@ks ~]# kubectl get svc ks-apiserver -n kubesphere-system -o jsonpath={.spec.clusterIP}
10.233.56.50

[root@ks ~]# curl --location 'http://10.233.56.50:80/kapis/tenant.kubesphere.io/v1beta1/clusters' \
--header 'Accept: application/json, text/plain, */*' \
--header "Authorization: Bearer $token"

# Able to access the KubeSphere API, but receiving insufficient permissions error.
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

##### 1.4 ServiceAccount Authorization

> GlobalRole authorization

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
> ClusterRole authorization

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
> Role authorization

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
> WorkspaceRole authorization

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