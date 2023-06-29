---
title: Access Control
weight: 3
description: Describes how to enable access control for custom extension resources.
---

This section describes how to enable access control for custom extension resources.

You can [use a custom resource definition (CRD) to create a custom resource (CR)](https://kubernetes.io/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/) in an extension, and use the `RoleTemplate` resource type introduced in this section to customize access control. In the KubeSphere web console, you can customize access control to create roles and grant roles to users, so that only users with specific roles are allowed to access custom resources of extensions.

`RoleTemplate` is a CRD provided by KubeSphere, built on top of Kubernetes-native role-based access control (RBAC) authentication mechanism. 以此来提供一个权限项。权限项是权限控制的最小单元，我们用这个类型来定义对一个功能的操作权限。然后聚合多个权限项以此形成一个角色。基于权限项，我们可能自由的创建定制角色的能力。

For more information about the Kubernetes RBAC authentication mechanism, see [Kubernetes official documentation](https://kubernetes.io/zh-cn/docs/reference/access-authn-authz/rbac/#clusterrole-example).

在Kubesphere用户界面中，我们通常在获得一个资源时，同时也希望获得这个资源相关联的其他资源。我们把一组关联密集的资源的权限放在一个RoleTemplate中，以满足在用户界面上的使用需求。

## RoleTemate examples

假设扩展组件中定义了 CRD `custom-resource` `custom-resource-version`。我们期望 KubeSphere 用户在用户界面查看 custom-resource 时能够同时返回 custom-resource-version, 以下 YAML 文件创建了 `global-custom-resource-viewing` 和 `global-custom-resource-creation` 两个自定义权限，分别授权用户查看和创建 `custom-resource` 类型的资源，其中 `global-custom-resource-creation` 依赖于 `global-custom-resource-viewing`。

```yaml
apiVersion: iam.kubesphere.io/v1beta1
kind: RoleTemplate
metadata:
  name: global-custom-resource-view
  labels:
    iam.kubesphere.io/category: custom-resource-management
    scope.kubesphere.io/workspace: ""
spec: 
  displayName: 
    en: Custom Resource Viewing
  rules:
    - apiGroups:
        - custom-api-group
      resources:
        - custom-resource
        - custom-resource-version
      verbs:
        - list
        - get
        - watch
```

```yaml
apiVersion: iam.kubesphere.io/v1beta1
kind: RoleTemplate
metadata:
  name: global-custom-resource-manage
  annotations:
    iam.kubesphere.io/dependencies: global-custom-resource-view
  labels:
    iam.kubesphere.io/category: custom-resource-management
    scope.kubesphere.io/workspace: ""
spec:
  displayName:
    en: Custom Resource Viewing
  rules:
    - apiGroups:
        - custom-api-group
      resources:
        - custom-resource
        - custom-resource-version
      verbs:
        - *
```

### Parameters

The following content describes how to configure parameters for custom permissions.

* `apiVersion`: the API version for KubeSphere access control. 当前版本为 `iam.kubesphere.io/v1beta1`。

* `kind`: the resource type of the custom permission. Set the value to `RoleTemplate`.

* `metadata`: the metadata for the custom permission.

  * `name`: the resource name of the custom permission.
  * `annotations`：

     * `iam.kubesphere.io/dependencies`: 在 Console 中会显示为依赖关系，当选中这个权限项时会自动选中依赖的权限项

  * `labels`：

    * `scope.kubesphere.io/global`：自定义权限的资源标签。KubeSphere 将权限分为平台、集群、企业空间和项目权限。取值 `global` 表示当前权限为平台级别的权限。可选的值有 `global`、`cluster`、`workspace` 和 `namespace`。
    * `iam.kubespere.io/category: custom-resource-management`：标记权限项所属的类别。
* `spec`

  * `displayName`：自定义权限的显示名称。KubeSphere Console 将显示此名称。

    * `en`：英文显示名称。

    * `zh`：中文显示名称。

  * `rules`: the resources and operations allowed by the custom permission. 此参数为自定义权限内容的实际定义。

    * `apiGroups`: the API group to which the resource type belongs. Value `*` indicates all API groups.

    * `resources`：向用户授权的资源类型，可以为 CRD（例如本节示例中的 `custom-resource`，`custom-resource-version`）或 Kubernetes 默认资源类型（例如 `deployment`）。Value `*` indicates all resource types.

    * `verbs`: the operations authorized to the user. Value `*` indicates all operations at the permission level. For more information about resource types, see [Kubernetes official documentation](https://kubernetes.io/docs/reference/access-authn-authz/authorization/).


## Category

Category 用于标记 RoleTemplate 所属的类别。KubeSphere Console 将根据权限项的类别将权限项分组显示。对应R oleTemplate 的 label `iam.kubesphere.io/category: custom-resource-management`。

```yaml
---
apiVersion: iam.kubesphere.io/v1beta1
kind: Category
metadata:
  name: custom-resource-management
  labels:
    scope.iam.kubesphere.io/global: ""
    scope.iam.kubesphere.io/workspace: ""
spec:
  displayName:
    en: Custom Resource Management
```

### Category 参数说明
 * `apiVersion`: the API version for KubeSphere access control. 当前版本为 `iam.kubesphere.io/v1beta1`。

 * `kind`: the resource type of the custom permission. 请将参数值设置为 `Category`。

 * `metadata`: the metadata for the custom permission.

   * `name`: the resource name of the custom permission.

   * `labels`：

     * `scope.kubesphere.io/global`：自定义权限的资源标签。KubeSphere 将权限分为平台、集群、企业空间和项目权限。取值 `global` 表示当前权限为平台级别的权限。可选的值有 `global`、`cluster`、`workspace` 和 `namespace`。

     * `scope.iam.kubesphere.io/workspace`：此类资源包含了多了层级的权限，所以同时指定了 global 和 workspace 标签。

    * `spec`

      * `displayName`：自定义权限的显示名称。KubeSphere Console 将显示此名称。

        * `en`：英文显示名称。

        * `zh`：中文显示名称。


## Best Practices

TODO