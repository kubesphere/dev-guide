---
title: 访问权限控制
weight: 504
description: 为您的扩展组件集成 KubeSphere 的访问权限控制
---
## 概述
KubeSphere 拥有完整的访问权限控制机制，我们为每一个资源都配置了相应的权限项。相应的，当您在开发 KubeSphere 扩展组件时，也可以为您的扩展组件配置权限项。

{{% notice note %}}
在阅读本章节之前，我们默认您已经熟悉了 KubeSphere 权限控制相关的知识。如果您对此不熟悉，请参考 [KubeSphere 权限控制](https://todo) 。
{{% /notice %}}

## KubeSphere 扩展组件的资源层级
在 KubeSphere 中，我们尽可能的把所有可操作的资源抽象成了 Kubernetes 自定义资源（Custom Resource），且制定了相应的 API 的规范。对资源进行统一的分组，
分层，版本控制，权限控制等管理。如果你对此还不熟悉，请参考 [KubeSphere API资源](https://todo) 。

我们约定了每个资源都应该属于某一个层级，资源分层有利于我们在 KubeSphere 多租户系统中为不同租户分配资源权限，为不同资源限定了其可分配的权限边界。
我们将资源分为以下层级：
- Global（平台）
- Cluster（集群）
- Workspace（企业空间）
- Project （项目）
- DevOps Project（DevOps 项目）

当我们在开发 KubeSphere 扩展组件时，首先需要考虑扩展组件需要包含哪些资源，然后需要确定资源所属的层级。这样 KubeSphere 才能对资源进行权限控制。

## KubeSphere 扩展组件的权限模板

### 权限模板
权限模板（RoleTemplate）是权限项的承载体。我们使用权限模板来定义权限项。权限项是权限定义的最小单元。我们将某一种资源的特定权限定义在一个权限项里。

以下示例是管理 devops 的权限模板：
```yaml
apiVersion: iam.kubesphere.io/v1alpha2
kind: RoleTemplate
metadate:
  name: role-template-create-devops
  labels:
    scope.kubesphere.io/workspace: ""
spec:
  templateScope: workspace
  role:
    apiVersion: iam.kubesphere.io/v1alpha2
    kind: WorkspaceRole
    metadata:
      annotations:
        iam.kubesphere.io/module: DevOps Management
        iam.kubesphere.io/role-template-rules: '{"devops": "create"}'
        kubesphere.io/alias-name: DevOps Create
      labels:
        iam.kubesphere.io/role-template: "true"
      name: role-template-create-devops
    rules:
      - apiGroups:
          - '*'
        resources:
          - 'devops'
          - 'devopsprojects'
        verbs:
          - create
          - watch
```

| 字段 | 描述 |
| --- | --- |
| metadate.labels scope | 这个 label 用来筛选不同层级的权限项。|
| spec.templateScope | 权限项的层级，可选参数：global，cluster，workspace，namespace。 |
| spec.role | 权限项。这个字段是一个完整的角色定义，不同层级的权限项的角色定义不尽相同。|

### 权限项

上面的内容中我们简单介绍了关于权限模板比较重要的字段，其中值得我们注意的字段有两个，metadate.labels scope 和
spec.role。这两个字段分别表示权限项的层级，和权限项的具体权限定义。下面我们来分别讨论它们。

#### Scope Label
Scope label 字段可以用来快速筛选不同层级的权限项。有以下几种不同的 label 可选：
- scope.kubesphere.io/global
- scope.kubesphere.io/cluster
- scope.kubesphere.io/workspace 
- scope.kubesphere.io/namespace
- scope.kubesphere.io/devops

以上五个标签分别对应 平台，集群，企业空间，项目空间，DevOps项目。

#### Role
role 字段定义了一个完整的角色。不同层级的权限定义使用不同的类型, 其结构或借鉴或直接引用了 Kubernetes Role。如果您不熟悉 Kubernetes Role，请参考 
[Role and ClusterRole](https://kubernetes.io/zh-cn/docs/reference/access-authn-authz/rbac/#role-and-clusterole) 。 
有以下几种不同类型可选：
- GlobalRole
- ClusterRole
- WorkspaceRole
- ProjectRole

下面我们将举例不同的层级的权限要如何定义。

#### Global Role

| spec.role.apiVersion | spec.role.kind | metadata.labels | spec.templateScope |
| --- | --- | --- | --- |
|iam.kubesphere.io/v1alpha2 | GlobalRole | scope.kubesphere.io/global: "" | global |

```yaml
apiVersion: iam.kubesphere.io/v1alpha2
kind: RoleTemplate
metadata:
  name: role-template-manage-clusters
  labels:
    scope.kubesphere.io/global: ""
spec:
  templateScope: global
  role:
    apiVersion: iam.kubesphere.io/v1alpha2
    kind: GlobalRole
    metadata:
      annotations:
        iam.kubesphere.io/dependencies: '["role-template-view-clusters"]'
        iam.kubesphere.io/module: Clusters Management
        iam.kubesphere.io/role-template-rules: '{"clusters": "manage"}'
        kubesphere.io/alias-name: Clusters Management
      labels:
        iam.kubesphere.io/role-template: "true"
      name: role-template-manage-clusters
    rules:
      - apiGroups:
          - ""
          - apiextensions.k8s.io
          - app.k8s.io
          - apps
          - autoscaling
          - batch
          - config.istio.io
          - devops.kubesphere.io
          - devops.kubesphere.io
          - events.k8s.io
          - events.kubesphere.io
          - extensions
          - istio.kubesphere.io
          - jaegertracing.io
          - logging.kubesphere.io
          - metrics.k8s.io
          - monitoring.coreos.com
          - monitoring.kubesphere.io
          - metering.kubesphere.io
          - network.kubesphere.io
          - networking.istio.io
          - networking.k8s.io
          - node.k8s.io
          - rbac.istio.io
          - scheduling.k8s.io
          - security.istio.io
          - servicemesh.kubesphere.io
          - snapshot.storage.k8s.io
          - storage.k8s.io
          - storage.k8s.io
          - storage.kubesphere.io
          - resources.kubesphere.io
          - notification.kubesphere.io
          - alerting.kubesphere.io
          - cluster.kubesphere.io
          - types.kubefed.io
          - gitops.kubesphere.io
          - gateway.kubesphere.io
        resources:
          - '*'
        verbs:
          - '*'
      - apiGroups:
          - tenant.kubesphere.io
        resources:
          - workspaces
          - workspacetemplates
        verbs:
          - update
          - patch
      - apiGroups:
          - iam.kubesphere.io
        resources:
          - clustermembers
          - clusterroles
        verbs:
          - '*'
      - nonResourceURLs:
          - '*'
        verbs:
          - 'GET'
```

#### Cluster Role

| spec.role.apiVersion | spec.role.kind | metadata.labels | spec.templateScope |
| --- | --- | --- | --- |
|rbac.authorization.k8s.io/v1 | ClusterRole | scope.kubesphere.io/cluster: "" | cluster |

```yaml
apiVersion: iam.kubesphere.io/v1alpha2
kind: RoleTemplate
metadata:
  name: role-template-manage-crds
  labels:
    scope.kubesphere.io/cluster: ""
spec:
  templateScope: cluster
  role:
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRole
    metadata:
      annotations:
        iam.kubesphere.io/module: Cluster Resources Management
        kubesphere.io/alias-name: CRD Management
        iam.kubesphere.io/role-template-rules: '{"customresources": "manage"}'
      labels:
        iam.kubesphere.io/role-template: "true"
      name: role-template-manage-crds
    rules: []
```

#### Workspace Role

| spec.role.apiVersion | spec.role.kind | metadata.labels | spec.templateScope |
| --- | --- | --- | --- |
|iam.kubesphere.io/v1alpha2 | WorkspaceRole | scope.kubesphere.io/workspace: "" | workspace |

```yaml
apiVersion: iam.kubesphere.io/v1alpha2
kind: RoleTemplate
metadata:
  name: role-template-manage-workspace-settings
  labels:
    scope.kubesphere.io/workspace: ""
spec:
  templateScope: workspace
  role:
    apiVersion: iam.kubesphere.io/v1alpha2
    kind: WorkspaceRole
    metadata:
      annotations:
        iam.kubesphere.io/module: Workspace Settings
        iam.kubesphere.io/role-template-rules: '{"workspace-settings": "manage"}'
        kubesphere.io/alias-name: Workspace Settings Management
      labels:
        iam.kubesphere.io/role-template: "true"
      name: role-template-manage-workspace-settings
    rules:
      - apiGroups:
          - '*'
        resources:
          - 'workspaces'
        verbs:
          - '*'
```

#### Project Role

| spec.role.apiVersion | spec.role.kind | metadata.labels | spec.templateScope |
| --- | --- | --- | --- |
| rbac.authorization.k8s.io/v1 | Role | scope.kubesphere.io/namespace: "" | namespace |

```yaml
apiVersion: iam.kubesphere.io/v1alpha2
kind: RoleTemplate
metadata:
  name: role-template-manage-serviceaccount
  labels:
    scope.kubesphere.io/namespace: ""
spec:
  templateScope: namespace
  role:
    apiVersion: rbac.authorization.k8s.io/v1
    kind: Role
    metadata:
      annotations:
        iam.kubesphere.io/dependencies: '["role-template-view-serviceaccount"]'
        iam.kubesphere.io/module: Configuration Center
        iam.kubesphere.io/role-template-rules: '{"serviceaccounts": "manage"}'
        kubesphere.io/alias-name: ServiceAccount Management
      labels:
        iam.kubesphere.io/role-template: "true"
      name: role-template-manage-serviceaccount
    rules:
      - apiGroups:
          - '*'
        resources:
          - 'serviceaccounts'
        verbs:
          - '*'
```


