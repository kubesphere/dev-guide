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

        * `iam.kubesphere.io/role-template`: whether to display the custom permission at the KubeSphere frontend. Value `true` indicates that the custom permission appears at the KubeSphere frontend.

      * `annotations`: the annotations of the custom permission.

        * `iam.kubesphere.io/module`: the group to which the custom permission belongs.

        * `iam.kubesphere.io/role-template-rules`: the resource types and operations granted by the custom permission. For example, `'{"custom-resource": "create"}'</ 0> indicates the permission to create resources of the <code>custom-resource` type. This parameter is only for the KubeSphere frontend to obtain the permission content, and does not define the permission. For example, the KubeSphere frontend can determine whether to display extensions for a specific user based on the value returned by this parameter. Permissions are defined by `spec:role:rules`. This parameter value must match the `spec:role:rules` parameter setting to prevent frontend logic errors.

        * `kubesphere.io/alias-name`: the name of the custom permission displayed on the front end of KubeSphere.

        * `iam.kubesphere.io/dependencies`: the resource name of other permissions that the custom permission depends on.

      * `rules`: the resources and operations allowed by the custom permission. This parameter defines the custom permission content, which is different from `iam.kubesphere.io/role-template-rules`.

        * `apiGroups`: the API group to which the resource type belongs. Value `*` indicates all API groups.

        * `resources`: the resource type authorized to the user, which can be CRD (such as `custom-resource` in the example) or Kubernetes default resource type (such as `deployment</ 0>). Value <code>*` indicates all resource types.

        * `verbs`: the operations authorized to the user. Value `*` indicates all operations at the permission level. For more information about resource types, see [Kubernetes official documentation](https://kubernetes.io/docs/reference/access-authn-authz/authorization/).
