---
title: 授权
weight: 221
description: KubeSphere 中的多用户授权
---

## 概述
    
KubeSphere 为满足企业级 Kubernetes 需求，提供了基于 Kubernetes 的多租户系统。在 KubeSphere 中，我们提供了不同层级和粒度的
的资源管理机制，同时包含了一整套 IAM（身份识别与访问控制）系统，用来保障企业级集群的安全。

## 角色与权限

### 内置角色
KubeSphere 租户的设计基于 [RBAC (Role-Based Access Control) ](https://en.wikipedia.org/wiki/Role-based_access_control) 权限模型。
以角色为权限基础，不同角色被授予不同的资源访问权限。每个用户都有对应的角色。

KubeSphere 提供了四个内置的角色。

| 内置角色 | 描述 |
| --- | --- |
| platform-regular | 平台普通用户，可以被绑定到企业空间，授予资源操作权限。 |
| platform-admin | 平台管理员，管理平台所有资源的权限。|
| workspace-manager | 企业空间管理员，管理平台所有企业空间。 |
| user-manager | 用户管理员，管理平台所有的用户。|

KubeSphere 在安装完成后提供了内置的管理员用户 `admin`，此内置用户拥有所有的资源管理权限，提供给集群的管理者用来初始化和管理集群。
`admin` 用户就绑定了角色 `platform-admin`。

{{% notice note %}}
想要详细体验内置角色，KubeSphere 用户文档中提供了完整的用户和企业空间管理实例，请参见
[创建企业空间、项目、用户和平台角色](https://kubesphere.io/zh/docs/v3.3/quick-start/create-workspace-and-project/)
{{% /notice %}}

除此之外，我们也支持自定义角色，自定义的角色可根据内置的权限模板自由定制角色。
![custom-role](./costom-role.png)

### RBAC 在 KubeSphere 权限控制中的实践

KubeSphere 中的权限控制依赖 [CRD (Custom Resources Define)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)，
使用 CR 存储在 Kubernetes 集群中。 CRD 的 Group 一般为 `iam.kubesphere.io` 。例如，用户的账号信息存储在 `Users` 中。

下面示例是 `admin`(平台管理员) 的账户信息。

```yaml
apiVersion: iam.kubesphere.io/v1alpha2
kind: User
metadata:
  annotations:
    helm.sh/resource-policy: keep
    meta.helm.sh/release-name: ks-core
    meta.helm.sh/release-namespace: kubesphere-system
  finalizers:
    - finalizers.kubesphere.io/users
  labels:
    app.kubernetes.io/managed-by: Helm
  name: admin
spec:
  email: admin@kubesphere.io
  password: $2a$10$zcHepmzfKPoxCVCYZr5K7ORPZZ/ySe9p/7IUb/8u./xHrnSX2LOCO
```
同样的，上述的四个内置角色在 `GlobalRole` 中可以找到，下面示例是 `platform-admin` 的角色定义

```yaml
apiVersion: iam.kubesphere.io/v1alpha2
kind: GlobalRole
metadata:
  annotations:
    iam.kubesphere.io/aggregation-roles: >-
      ["role-template-manage-clusters","role-template-view-clusters","role-template-view-roles","role-template-manage-roles","role-template-view-roles","role-template-view-workspaces","role-template-manage-workspaces","role-template-manage-users","role-template-view-roles","role-template-view-users","role-template-manage-app-templates","role-template-view-app-templates","role-template-manage-platform-settings"]
    kubectl.kubernetes.io/last-applied-configuration: >
      {"apiVersion":"iam.kubesphere.io/v1alpha2","kind":"GlobalRole","metadata":{"annotations":{"iam.kubesphere.io/aggregation-roles":"[\"role-template-manage-clusters\",\"role-template-view-clusters\",\"role-template-view-roles\",\"role-template-manage-roles\",\"role-template-view-roles\",\"role-template-view-workspaces\",\"role-template-manage-workspaces\",\"role-template-manage-users\",\"role-template-view-roles\",\"role-template-view-users\",\"role-template-manage-app-templates\",\"role-template-view-app-templates\",\"role-template-manage-platform-settings\"]","kubesphere.io/creator":"admin"},"name":"platform-admin"},"rules":[{"apiGroups":["*"],"resources":["*"],"verbs":["*"]},{"nonResourceURLs":["*"],"verbs":["*"]}]}
    kubesphere.io/creator: admin
  name: platform-admin
rules:
  - apiGroups:
      - '*'
    resources:
      - '*'
    verbs:
      - '*'
  - nonResourceURLs:
      - '*'
    verbs:
      - '*'
```

最后，角色`platform-admin` 和用户 `admin` 的绑定关系在 `GlobalRoleBinding` 中可以找到

```yaml
apiVersion: iam.kubesphere.io/v1alpha2
kind: GlobalRoleBinding
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: >
      {"apiVersion":"iam.kubesphere.io/v1alpha2","kind":"GlobalRoleBinding","metadata":{"annotations":{},"name":"admin"},"roleRef":{"apiGroup":"iam.kubesphere.io/v1alpha2","kind":"GlobalRole","name":"platform-admin"},"subjects":[{"apiGroup":"iam.kubesphere.io/v1alpha2","kind":"User","name":"admin"}]}
  name: admin
roleRef:
  apiGroup: iam.kubesphere.io/v1alpha2
  kind: GlobalRole
  name: platform-admin
subjects:
  - apiGroup: iam.kubesphere.io/v1alpha2
    kind: User
    name: admin
```

从上面的实例中可以看出，KubeSphere 中的权限定义借鉴了 Kubernetes 对于资源权限控制的设计。这种方式减少了 KubeSphere 对外部中间件的依赖。

### 权限项

上面示例中我们讲过自定义角色可以根据权限模板自由定制需要的角色。从之前的示例中可以看出，我们将 KubeSphere 中所有的资源使用到的权限拆分成单独的选项，
在 KubeSphere 中这些选项也是单独的权限定义。 KubeSphere 使用权限模板保存这些权限项。如果你在阅读上面的文档时足够细心，就会发现 platform-admin 
角色的 yaml 定义的元数据中有一个键为 `iam.kubesphere.io/aggregation-roles` 的标签。这个标签的意思是：聚合这些权限项到这个角色，
当我们在创建角色时， 正是根据这个标签中的值来组合权限模板中的权限项，将其聚合成一个角色，所以权限模板在 KubeSphere 中至关重要。
具体的业务代码可以在 [CreateOrUpdateGlobalRole](https://github.com/kubesphere/kubesphere/blob/master/pkg/models/iam/am/am.go#L831-L851)
找到。


具体的权限模板我们可以在 Group 为 `iam.kubesphere.io` 的各个 CRD 中找到。这些权限模板的 CR 的都以 role-template 为前缀。例如，在 KubeSphere 集群中
执行下列命令可以得到 GlobalRole 中的所有权限模板。
```bash
kubectl get globalroles.iam.kubesphere.io | grep role-template
```

```bash
root@develop-env:~# kubectl get globalroles.iam.kubesphere.io | grep role-template
role-template-manage-app-templates       24d
role-template-manage-clusters            24d
role-template-manage-platform-settings   24d
role-template-manage-roles               24d
role-template-manage-users               24d
role-template-manage-workspaces          24d
role-template-view-app-templates         24d
role-template-view-basic                 24d
role-template-view-clusters              24d
role-template-view-roles                 24d
role-template-view-users                 24d
role-template-view-workspaces            24d
```

## 权限层级

在上文中我们详细介绍了 KubeSphere 通过 RBAC 基于角色来实现不同角色和用户的绑定，角色又基于不同的权限项组成。
为了实现细粒度的访问控制，我们将角色划分为不同层级，相应的，角色对应的权限模板也被划分为不同层级。
![role](./role.png)

从图中可以看出，蓝色实线框内，我们将角色划分为以下四个层级
- Global Role
- Cluster Role
- Workspace Role
- Project/DevOps Role

对应的，层级角色用来管理以下相应层级的资源
- Global Scope 表示全局范围
- Cluster Scope 表示集群范围
- Workspace Scope 表示企业空间范围
- Namespace Scope 表示命名空间范围


每个层级中都有这样的三个模块 
- Role-Template
- Built-in Role
- Custom Role

这三个模块都不难理解，
Role-Template 表示权限模板;
Built-in Role 表示这是内置角色(我们提到过内置平台管理员 platform-admin 就是 Global 层级中的内置角色）;
Custom Role 则是用户自定义的定制角色。每个层次的自定义角色都是由 Role-Template 组合而成。正如我们在上文提到过的角色的定义中
`iam.kubesphere.io/aggregation-roles` 标签中的值就是此角色的所包含的权限项。内置角色也包含也包含了这个字段，只不过内置角色是系统在初始化时
会被自动预设，而自定义角色是用户自己定制完成的。

**RoleBase 又是什么？**

RoleBase 对用户来说是无法感知的，这个模块作为其他模块的基础，主要用来构建 Project/DevOps Role 和 Workspace Role
RoleBase中包含两种CR， **权限项模板（Role Template）** 和 **内置角色模板（Built-in Role）**。
在 Namespace 层，由于Namespace 天生的隔离性限制，Workspace 是由 Namespace 构成，所以我们在每个 Namespace 被创建时都会将 RoleBase 
中的 Role Template复制到这个NS中。 同时也将相应的 Built-in Role 复制到 Workspace 和 Namespace 中。这样做可以方便后续的角色和用户绑定。



