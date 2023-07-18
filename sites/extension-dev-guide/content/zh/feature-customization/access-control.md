---
title: 访问控制
weight: 03
description: 介绍如何控制扩展组件定制资源的访问权限。
---

本章节介绍如何控制扩展组件定制资源的访问权限。

您可以在扩展组件中[使用定制资源定义（CRD）创建定制资源（CR）](https://kubernetes.io/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)，并使用本节介绍的 `RoleTemplate` 资源类型创建自定义权限。在 KubeSphere Console，您可以使用自定义的权限创建角色并将角色授权给用户，从而只允许具有特定角色的用户访问扩展组件定制资源。

`RoleTemplate` 是由 KubeSphere 提供的 CRD， 基于 Kubernetes 原生的 RBAC 鉴权机制实现。以此来提供一个权限项。权限项是权限控制的最小单元，我们用这个类型来定义对一个功能的操作权限。然后聚合多个权限项以此形成一个角色。基于权限项，我们可能自由的创建定制角色的能力。

有关 Kubernetes RBAC 鉴权机制的更多信息，请参阅 [Kubernetes 官方文档](https://kubernetes.io/zh-cn/docs/reference/access-authn-authz/rbac/#clusterrole-example)。

在Kubesphere用户界面中，我们通常在获得一个资源时，同时也希望获得这个资源相关联的其他资源。我们把一组关联密集的资源的权限放在一个RoleTemplate中，以满足在用户界面上的使用需求。

## RoleTemplate 示例

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

### RoleTemplate 参数说明

以下介绍如何设置自定义权限的参数。

* `apiVersion`：KubeSphere 访问控制 API 的版本。当前版本为 `iam.kubesphere.io/v1beta1`。

* `kind`：自定义权限的资源类型。请将参数值设置为 `RoleTemplate`。

* `metadata`：自定义权限的元数据。

  * `name`：自定义权限的资源名称。
  * `annotations`：
  
     * `iam.kubesphere.io/dependencies`: 在 Console 中会显示为依赖关系，当选中这个权限项时会自动选中依赖的权限项

  * `labels`：

    * `scope.kubesphere.io/global`：自定义权限的资源标签。KubeSphere 将权限分为平台、集群、企业空间和项目权限。取值 `global` 表示当前权限为平台级别的权限。可选的值有 `global`、`cluster`、`workspace` 和 `namespace`。
    * `iam.kubespere.io/category: custom-resource-management`：标记权限项所属的类别。
* `spec`

  * `displayName`：自定义权限的显示名称。KubeSphere Console 将显示此名称。
  
    * `en`：英文显示名称。
    
    * `zh`：中文显示名称。
    
  * `rules`：自定义权限向用户授权的资源和操作。此参数为自定义权限内容的实际定义。

    * `apiGroups`：向用户授权的资源类型所属的 API 组。取值 `'*'` 表示当前权限级别的所有 API 组。

    * `resources`：向用户授权的资源类型，可以为 CRD（例如本节示例中的 `custom-resource`，`custom-resource-version`）或 Kubernetes 默认资源类型（例如 `deployment`）。取值 `'*'` 表示当前权限级别的所有资源类型。

    * `verbs`：向用户授权的操作。取值 `'*'` 当前权限级别的所有操作。有关资源操作类型的更多信息，请参阅 [Kubernetes 官方文档](https://kubernetes.io/docs/reference/access-authn-authz/authorization/)。

  
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
 * `apiVersion`：KubeSphere 访问控制 API 的版本。当前版本为 `iam.kubesphere.io/v1beta1`。

 * `kind`：自定义权限的资源类型。请将参数值设置为 `Category`。

 * `metadata`：自定义权限的元数据。

   * `name`：自定义权限的资源名称。

   * `labels`：
 
     * `scope.kubesphere.io/global`：自定义权限的资源标签。KubeSphere 将权限分为平台、集群、企业空间和项目权限。取值 `global` 表示当前权限为平台级别的权限。可选的值有 `global`、`cluster`、`workspace` 和 `namespace`。
     
     * `scope.iam.kubesphere.io/workspace`：此类资源包含了多了层级的权限，所以同时指定了 global 和 workspace 标签。
     
    * `spec`

      * `displayName`：自定义权限的显示名称。KubeSphere Console 将显示此名称。
      
        * `en`：英文显示名称。
        
        * `zh`：中文显示名称。


## 最佳实践

TODO