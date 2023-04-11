---
title: Access Control
weight: 3
description: Describes how to enable access control for custom extension resources.
---

This section describes how to enable access control for custom extension resources.

You can [use a custom resource definition (CRD) to create a custom resource (CR)](https://kubernetes.io/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/) in an extension, and use the `RoleTemplate` resource type introduced in this section to customize access control. In the KubeSphere web console, you can customize access control to create roles and grant roles to users, so that only users with specific roles are allowed to access custom resources of extensions.

`RoleTemplate` is a CRD provided by KubeSphere, built on top of Kubernetes-native role-based access control (RBAC) authentication mechanism. For more information about the Kubernetes RBAC authentication mechanism, see [Kubernetes official documentation](https://kubernetes.io/zh-cn/docs/reference/access-authn-authz/rbac/#clusterrole-example).

## RoleTemate examples

Assume that CRD `custom-resource` is defined in the extension. The following YAML file creates two custom permissions, `role-template-custom-resource-viewing` and `role-template-custom-resource-creation`, which authorize users to view and create resources of the `custom-resource` type. The permission `role-template-custom-resource-creation` is on top of `role-template-custom-resource-viewing`.

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

### Parameters

The following content describes how to configure parameters for custom permissions.

* `apiVersion`: the API version for KubeSphere access control. The current version is `iam.kubesphere.io/v1alpha2`.

* `kind`: the resource type of the custom permission. Set the value to `RoleTemplate`.

* `metadata`: the metadata for the custom permission.

  * `name`: the resource name of the custom permission.

  * `labels`: the labels for the custom permission. KubeSphere provides permissions at different levels: platform, cluster, workspace, and project. It identifies the level of custom permissions based on the following labels:

    * `scope.kubesphere.io/global`: platform-level.

    * `scope.kubesphere.io/cluster`: cluster-level.

    * `scope.kubesphere.io/workspace`: workspace-level.

    * `scope.kubesphere.io/project`: project-level.

* `spec`

  * `role`

    * `apiVersion`: the API version for KubeSphere access control. The current version is `iam.kubesphere.io/v1alpha2`.

    * `kind`: the level of the custom permission. The parameter value must match the setting of the `metadata:labels` parameter. Valid values:

      * `GlobalRole`: platform-level.

      * `ClusterRole`: cluster-level.

      * `WorkspaceRole`: workspace-level.

      * `ProjectRole`: project-level.

    * `metadata`

      * `name`: the name of the custom permission. The parameter value must match the setting of the `metadata:name` parameter.

      * `labels`: the labels for the custom permission.

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
