---
title: Access Control
weight: 3
description: 介绍如何控制扩展组件定制资源的访问权限
---

This section describes how to enable access control for custom extension resources.

You can [use a custom resource definition (CRD) to create a custom resource (CR)](https://kubernetes.io/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/) in an extension, and use the `RoleTemplate` resource type introduced in this section to customize access control. In the KubeSphere web console, you can customize access control to create roles and grant roles to users, so that only users with specific roles are allowed to access custom resources of extensions.

`RoleTemplate` is a CRD provided by KubeSphere, built on top of Kubernetes-native role-based access control (RBAC) authentication mechanism. It is used to provide a permission item. A permission item is the smallest unit of permission control, which can be used to define permissions for a function. With multiple permission items, a role can be formed. 基于权限项，我们可以自由地创建定制角色。

For more information about the Kubernetes RBAC authentication mechanism, see [Kubernetes official documentation](https://kubernetes.io/zh-cn/docs/reference/access-authn-authz/rbac/#clusterrole-example).

In the Kubesphere user interface, users usually want to obtain other resources associated with the resource they get. 我们把一组关联密集的资源的权限放在一个 RoleTemplate 中，以满足在用户界面上的使用需求。

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

     * `iam.kubesphere.io/dependencies`: 在 Console 中会显示为依赖关系，当选中这个权限项时会自动选中依赖的权限项。
     * `iam.kubesphere.io/role-template-rules`: 具体控制 Console 权限规则，相见下文 Console 前端权限控制。

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

     * `scope.iam.kubesphere.io/workspace`：此类资源包含了多个层级的权限，所以同时指定了 global 和 workspace 标签。

    * `spec`

      * `displayName`: the display name of the custom permission. KubeSphere Console will be displayed with this name.

        * `en`: display name in English.

        * `zh`: display name in Chinese.

### Console 前端权限控制
  * menu 权限设置
  ```JavaScript
  // menu 涉及权限字段
  const menu = { 
  name: 'hello-world',         // name 必填字段
  ksModule: 'hello-world',    
  authKey: 'hello-world',     
  skipAuth: true,      
};
  ```
权限过滤效果
|   | Permission | Parameter           | Note                               |
| - | ---------- | ------------------- | ---------------------------------- |
| 1 | 根据模块是否安装过滤 | `ksModule`          | 未安装模块不显示                           |
| 2 | 根据配置权限过滤   | `authKey` or `name` | 有 `authKey` 取 `authKey`，否则取 `name` |
| 3 | 跳过权限控制     | `skipAuth`          | 优先级最高，为 `true` 则忽略 1 和 2 配置        |

  * RoleTemplate 前端权限控制
  ```yaml
- metadata:
    annotations:
      iam.kubesphere.io/role-template-rules: '{"pipelines":"view"}'
- metadata:
    annotations:
      iam.kubesphere.io/role-template-rules: '{"pipelines":"manage"}'
```
  * RoleTemplate 前端权限控制参数说明
    * `iam.kubesphere.io/role-template-rules`：控制前端权限的注解， `{key: action }` 格式 JSON 字符串。
    * `{key}`：前端权限的 key，对应前端权限的 `authKey` 或 `name` 字段。
    * `{action}`: 见 RoleTemplate 前端权限控制 action。

  * RoleTemplate 前端权限控制 action
    * `view`：有此字段，会显示对应的菜单和页面。但只有查看权限，没有操作权限。
    * `*`、`manage`：有完整查看和操作权限。
    * `create`: 有创建权限。
    * `delete`: 有删除权限。
    * `edit`: 有编辑权限。
    * 其他自定义值（配合前端硬编码）。 > 注：`create`、`delete`、`edit` 为前端权限，需配合前端代码，在对应操作的按钮上添加类似 `action: 'create'` 代码，下例。

 ```JavaScript
  // 代码片段
  import { useActionMenu, DataTable } from '@ks-console/shared';}
  const renderTableAction = useActionMenu({
    autoSingleButton: true,
    authKey,
    params,
    actions: [
      {
        key: 'invite',
        text: t('INVITE'),
        action: 'create',  //此处为具体 action 
        props: {
          color: 'secondary',
          shadow: true,
        },
        onClick: openCreate,
      },
    ],
  });
  return (<DataTable 
    // ... the other props
    toolbarRight={renderTableAction({})}
  />)
 ```



## Best Practices

TODO