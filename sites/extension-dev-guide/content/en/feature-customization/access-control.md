---
title: Access Control
weight: 3
description: Describes how to manage access control for custom resources of extensions.
---

This section describes how to enable access control for custom extension resources.

You can [use a custom resource definition (CRD) to create a custom resource (CR)](https://kubernetes.io/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/) in an extension, and use the `RoleTemplate` resource type introduced in this section to customize access control. In the KubeSphere web console, you can customize access control to create roles and grant roles to users, so that only users with specific roles are allowed to access custom resources of extensions.

`RoleTemplate` is a CRD provided by KubeSphere, built on top of Kubernetes-native role-based access control (RBAC) authentication mechanism. It is used to provide a permission item. A permission item is the smallest unit of permission control, which can be used to define permissions for a function. With multiple permission items, a role can be formed. Based on permission items, custom roles can be freely created.

For more information about the Kubernetes RBAC authentication mechanism, see [Kubernetes official documentation](https://kubernetes.io/zh-cn/docs/reference/access-authn-authz/rbac/#clusterrole-example).

In the Kubesphere user interface, users usually want to obtain other resources associated with the resource they get. The permissions of a group of closely-related resources are placed in a RoleTemplate to meet the usage requirements on the user interface.

## RoleTemplate examples

Assume that CRD `custom-resource` `custom-resource-version` is defined in the extension. We expect that it returns custom-resource-version when KubeSphere users view custom-resource in the user interface. The following YAML files create two custom permissions: `global-custom-resource-viewing` and `global-custom-resource- creation`, respectively authorizing users to view and create resources in the `custom-resource` type, where `global-custom-resource-creation ` depends on `global-custom-resource-viewing`.

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

### RoleTemplate parameters

The following content describes how to configure parameters for custom permissions.

* `apiVersion`: the API version for KubeSphere access control. The current version is `iam.kubesphere.io/v1beta1`.

* `kind`: the resource type of the custom permission. Set the value to `RoleTemplate`.

* `metadata`: the metadata of the custom permission.

  * `name`: the resource name of the custom permission.
  * `annotations`:

     * `iam.kubesphere.io/dependencies`: it will be displayed as a dependency on the Console, and when this permission item is selected, the dependent permission item will be automatically selected.

  * `labels`:

    * `scope.kubesphere.io/global`: the resource label of custom permissions. KubeSphere divides permissions into platforms, clusters, workspaces and project permissions. `global` indicates that the current permission is at the platform level. The value can be `global`, `cluster`, `workspace` and `namespace`.
    * `iam.kubespere.io/category: custom-resource-management`: Mark the category of the permission item.
* `spec`

  * `displayName`: the display name of the custom permission. KubeSphere Console will be displayed with this name.

    * `en`: display name in English.

    * `zh`: display name in Chinese.

  * `rules`: the resources and operations allowed by the custom permission. This parameter is the actual definition of the content of custom permissions.

    * `apiGroups`: the API group to which the resource type belongs. The value `*` indicates all API groups.

    * `resources`: the resource type authorized to users, which can be CRD (for instance, `custom-resource`, `custom-resource-version` in the examples in this section) or a Kubernetes default resource type (such as `deployment`). The value `*` indicates all resource types.

    * `verbs`: the operations authorized to the user. The value `*` indicates all operations at the permission level. For more information about resource types, see [Kubernetes official documentation](https://kubernetes.io/docs/reference/access-authn-authz/authorization/).


## Category

Category is used to mark the category of RoleTemplate. KubeSphere Console displays permission items in groups according to their categories. 对应 RoleTemplate 的 label `iam.kubesphere.io/category: custom-resource-management`。

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

### Category parameters
 * `apiVersion`: the API version for KubeSphere access control.  The current version is `iam.kubesphere.io/v1beta1`.

 * `kind`: the resource type of the custom permission.  Set the parameter value to `Category`.

 * `metadata`: the metadata for the custom permission.

   * `name`: the resource name of the custom permission.

   * `labels`:

     * `scope.kubesphere.io/global`: the resource label of custom permissions. KubeSphere divides permissions into platforms, clusters, workspaces and project permissions. `global` indicates that the current permission is at the platform level. The value can be `global`, `cluster`, `workspace` and `namespace`.

     * `scope.iam.kubesphere.io/workspace`：this type of resource contains multiple levels of permissions, so both the global and workspace labels are specified.

    * `spec`

      * `displayName`: the display name of the custom permission. KubeSphere Console will be displayed with this name.

        * `en`: display name in English.

        * `zh`: display name in Chinese.


## Best Practices

TODO