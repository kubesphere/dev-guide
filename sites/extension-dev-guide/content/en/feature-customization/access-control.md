---
title: Access Control
weight: 3
description: 介绍如何控制扩展组件定制资源的访问权限。
---

本节介绍如何控制扩展组件定制资源的访问权限。

您可以在扩展组件中[使用定制资源定义（CRD）创建定制资源（CR）](https://kubernetes.io/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)，并使用本节介绍的 `RoleTemplate` 资源类型创建自定义权限。在 KubeSphere Web 控制台，您可以使用自定义的权限创建角色并将角色授权给用户，从而只允许具有特定角色的用户访问扩展组件定制资源。

`RoleTemplate` 是由 KubeSphere 提供的 CRD， 基于 Kubernetes 原生的 RBAC 鉴权机制实现。有关 Kubernetes RBAC 鉴权机制的更多信息，请参阅 [Kubernetes 官方文档](https://kubernetes.io/zh-cn/docs/reference/access-authn-authz/rbac/#clusterrole-example)。

## RoleTemplate 示例

假设扩展组件中定义了 CRD `custom-resource`。以下 YAML 文件创建了 `role-template-custom-resource-viewing` 和 `role-template-custom-resource-creation` 两个自定义权限，分别授权用户查看和创建 `custom-resource` 类型的资源，其中 `role-template-custom-resource-creation` 依赖于 `role-template-custom-resource-viewing`。

```yaml
apiVersion: iam.kubesphere.io/v1alpha2
kind: RoleTemplate
metadata:
  name: role-template-custom-resource-viewing
  labels:
    scope.kubesphere.io/workspace: ""
spec:
  role:
    apiVersion: iam.kubesphere.io/v1alpha2
    kind: WorkspaceRole
    metadata:
      name: role-template-custom-resource-viewing
      labels:
        iam.kubesphere.io/role-template: "true"
      annotations:
        iam.kubesphere.io/module: Custom Permission Group
        iam.kubesphere.io/role-template-rules: '{"custom-resource": "list"}'
        kubesphere.io/alias-name: Custom Resource Viewing
    rules:
      - apiGroups:
          - custom-api-group
        resources:
          - custom-resource
        verbs:
          - list
```

```yaml
apiVersion: iam.kubesphere.io/v1alpha2
kind: RoleTemplate
metadata:
  name: role-template-custom-resource-creation
  labels:
    scope.kubesphere.io/workspace: ""
spec:
  role:
    apiVersion: iam.kubesphere.io/v1alpha2
    kind: WorkspaceRole
    metadata:
      name: role-template-custom-resource-creation
      labels:
        iam.kubesphere.io/role-template: "true"
      annotations:
        iam.kubesphere.io/module: Custom Permission Group
        iam.kubesphere.io/role-template-rules: '{"custom-resource": "create"}'
        kubesphere.io/alias-name: Custom Resource Creation
        iam.kubesphere.io/dependencies: '["role-template-custom-resource-viewing"]'
    rules:
      - apiGroups:
          - custom-api-group
        resources:
          - custom-resource
        verbs:
          - create
```

### RoleTemplate 参数说明

以下介绍如何设置自定义权限的参数。

* `apiVersion`：KubeSphere 访问控制 API 的版本。当前版本为 `iam.kubesphere.io/v1alpha2`。

* `kind`：自定义权限的资源类型。请将参数值设置为 `RoleTemplate`。

* `metadata`：自定义权限的元数据。

  * `name`：自定义权限的资源名称。

  * `labels`：自定义权限的资源标签。KubeSphere 将权限分为平台、集群、企业空间和项目权限，并通过以下标签识别自定义权限的级别：

    * `scope.kubesphere.io/global`：平台权限。

    * `scope.kubesphere.io/cluster`：集群权限。

    * `scope.kubesphere.io/workspace`：企业空间权限。

    * `scope.kubesphere.io/project`：项目权限。

* `spec`

  * `role`

    * `apiVerion`：KubeSphere 访问控制 API 的版本。当前版本为 `iam.kubesphere.io/v1alpha2`。

    * `kind`：自定义权限的级别，参数值必须与 `metadata:labels` 参数的设置匹配，取值可以为：

      * `GlobalRole`：平台权限。

      * `ClusterRole`：集群权限。

      * `WorkspaceRole`：企业空间权限。

      * `ProjectRole`：项目权限。

    * `metadata`

      * `name`：自定义权限的名称，参数值必须与 `metadata:name` 参数相同。

      * `labels`：自定义权限的资源标签。

        * `iam.kubesphere.io/role-template`：自定义权限是否在 KubeSphere 前端界面显示，一般设置为 `"true"` 即自定义权限在前端界面显示。

      * `annotations`：自定义权限的注解。

        * `iam.kubesphere.io/module`：自定义权限所属的权限分组。

        * `iam.kubesphere.io/role-template-rules`：自定义权限向用户授权的资源类型和操作，例如 `'{"custom-resource": "create"}'` 表示授权用户创建 `custom-resource` 类型的资源。此参数仅供 KubeSphere 前端获取权限内容，并不对权限内容进行实际定义。例如，KubeSphere 前端可根据此参数返回的值判断是否对特定用户显示扩展组件。权限内容实际由 `spec:role:rules` 参数定义。此参数值必须与 `spec:role:rules` 参数设置匹配以避免前端判断逻辑错误。

        * `kubesphere.io/alias-name`：自定义权限在 KubeSphere 前端显示的名称。

        * `iam.kubesphere.io/dependencies`：当前自定义权限依赖的其他权限的资源名称。

      * `rules`：自定义权限向用户授权的资源和操作。此参数为自定义权限内容的实际定义，区别于 `iam.kubesphere.io/role-template-rules` 参数。

        * `apiGroups`：向用户授权的资源类型所属的 API 组。取值 `'*'` 表示当前权限级别的所有 API 组。

        * `resources`：向用户授权的资源类型，可以为 CRD（例如本节示例中的 `custom-resource`）或 Kubernetes 默认资源类型（例如 `deployment`）。取值 `'*'` 表示当前权限级别的所有资源类型。

        * `verbs`：向用户授权的操作。取值 `'*'` 当前权限级别的所有操作。有关资源操作类型的更多信息，请参阅 [Kubernetes 官方文档](https://kubernetes.io/docs/reference/access-authn-authz/authorization/)。
