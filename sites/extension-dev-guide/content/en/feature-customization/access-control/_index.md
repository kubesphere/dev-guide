---
title: Access Control
weight: 04
description: Describes how to manage access control for custom resources of extensions.
---

This section describes how to integrate KubeSphere access control into extensions.

## Access control in KubeSphere

KubeSphere is a multi-tenant container management platform. Similar to Kubernetes, KubeSphere controls user permissions through Role-Based Access Control (RBAC) to achieve logical resource isolation.

In KubeSphere, the workspace is the smallest tenant unit, providing the ability to share resources across clusters and projects (i.e., namespaces in Kubernetes). Members in a workspace can create projects in authorized clusters and participate in project collaboration through invitation-based authorization.

Resources in KubeSphere are divided into four levels: platform, cluster, workspace, and project. All resources belong to these four levels, and access permissions for these resources are controlled by roles at each level.

**Platform Roles:** Mainly control user access to platform resources, such as cluster management, workspace management, and platform user management.

**Workspace Roles:** Mainly control access permissions of workspace members for resources under the workspace, such as project management, workspace member management, etc.

**Project Roles:** Mainly control access permissions for resources under the project, such as workload management, pipeline management, project member management, etc.

![rbac](rbac.png?width=900px)

### KubeSphere API

[KubeSphere API](../../references/kubesphere-api-concepts/) follows the same design mode as [Kubernetes API](https://kubernetes.io/zh-cn/docs/reference/using-api/api-concepts/). It is a resource-oriented (RESTful) programming interface provided over HTTP.
It supports the retrieval, creation, update, and deletion of main resources using standard HTTP verbs (POST, PUT, PATCH, DELETE, GET).

For certain resources, the API includes additional sub-resources, allowing for fine-grained authorization (e.g., separating the details and log retrieval for Pods).
To facilitate or improve efficiency, these resources can be accepted and served in different representations.

#### Kubernetes API terminology

Kubernetes commonly uses standard RESTful terminology to describe API concepts:

- **Resource Type:** The name (`pods`, `namespaces`, `services`) used in the URL.
- All resource types have a concrete representation (their object schema) , known as the **Kind**.
- A list of instances of a resource type is called a **Collection**.
- A single instance of a resource type is called a **Resource**, often also referred to as an **Object**.
- For certain resource types, the API includes one or more **sub-resources**, which are represented as URI paths under the resource.

Most Kubernetes API resource types are [objects](https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/): they represent concrete instances of a certain concept in the cluster, such as a Pod or a Namespace. A few API resource types are "virtual," typically representing operations rather than the objects themselves, such as permission checks (using a POST to the `subjectaccessreviews` resource with a JSON-encoded `SubjectAccessReview` subject) or the Pod's subresource `eviction` (used to trigger [API-initiated eviction](https://kubernetes.io/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)).

##### Object names

Every object you create via the API must have a unique name to allow for idempotent creation and retrieval. However, if virtual resource types are irretrievable or do not rely on idempotence, they may not have unique names.

Within a namespace, at any given moment, there can be only one object of a particular category with a given name. However, if you delete that object, you can create a new object with the same name. Some objects do not have namespace (e.g., nodes), so their names must be unique across the entire cluster.

#### API verbs

Almost all object resource types support standard HTTP verbs - GET, POST, PUT, PATCH, and DELETE. Kubernetes also uses its own verbs, which are typically written in lowercase to distinguish them from HTTP verbs.

Kubernetes uses the term **list** to describe a collection of returning resources, distinct from the retrieval of a single resource typically referred to as **get**. If you send an HTTP GET request with the `?watch` query parameter, Kubernetes calls it **watch** instead of **get**.

For PUT requests, Kubernetes internally categorizes them as **create** or **update** based on the state of the existing object. **Update** is distinct from **patch**; the HTTP verb for **patch** is PATCH.

#### Resource URI

Resource types can be:

For KubeSphere platform: `(apis/kapis)/GROUP/VERSION/*`

For clusters: `/clusters/CLUSTER/(apis/kapis)/GROUP/VERSION/*`

For workspaces: `(apis/kapis)/GROUP/VERSION/workspaces/WORKSPACE/*`

For namespaces: `/clusters/CLUSTER/(apis/kapis)/GROUP/VERSION/namespaces/NAMESPACE/*`

Note: KubeSphere supports multi-cluster management for Kubernetes. As long as you add the cluster identifier as a prefix before the request path, you can directly access the member cluster through the API. Kubernetes core resources use `/api` instead of `/apis` and do not include the GROUP path segment.

Example:

* `/apis/iam.kubesphere.io/v1beta1/users`
* `/apis/cluster.kubesphere.io/v1alpha2/clusters`
* `/cluster/host/api/v1/pods`
* `/kapis/iam.kubesphere.io/v1beta1/workspaces/my-workspace/devopsprojects`
* `/cluster/host/api/v1/namespaces/my-namespace/pods`

### RBAC

Role-Based Access Control (RBAC) is a method of controlling access to computer or network resources based on the roles of users in an organization.

The RBAC authorization mechanism uses `iam.kubesphere.io` to drive authorization decisions, allowing you to dynamically configure policies through the KubeSphere API.

The RBAC API declares eight CRD objects: **Role**, **ClusterRole**, **GlobalRole**, **WorkspaceRole**, **RoleBinding**, **ClusterRoleBinding**, **GlobalRoleBinding**, and **WorkspaceRoleBinding**.

**Role**, **ClusterRole**, **GlobalRole**, and **WorkspaceRole** in RBAC contain a set of rules representing related permissions. These permissions are purely cumulative (there are no rules to deny a specific operation).

**Role** is used to restrict access to namespace resources;
**ClusterRole** is used to restrict access to cluster resources;
**WorkspaceRole** is used to restrict access to enterprise workspace resources;
**GlobalRole** is used to restrict access to platform resources;

Here is an example of a **Role** located in the "default" namespace, which can be used to grant read access to Pods:

```yaml
apiVersion: iam.kubesphere.io/v1beta1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```
In the following example, **RoleBinding** grants the "pod-reader" Role to the user "jane" in the "default" namespace, which gives the user "jane" permission to read all Pods in the "default" namespace.

```yaml
apiVersion: iam.kubesphere.io/v1beta1
# This RoleBinding allows "jane" to read Pods in the "default" namespace.
# You should have a Role named "pod-reader" in that namespace.
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
# You can specify more than one "subject".
- kind: User
  name: jane # "name" is case-sensitive.
  apiGroup: iam.kubesphere.io
roleRef:
  # "roleRef" specifies the binding to a certain Role or ClusterRole.
  kind: Role        # This field must be either Role or ClusterRole.
  name: pod-reader  # This field must match the name of the Role or ClusterRole you want to bind.
  apiGroup: iam.kubesphere.io
```

## Custom permission items

KubeSphere supports freely creating custom roles through permission items to achieve fine-grained access control.

### RoleTemplate

<!-- You can [use a custom resource definition (CRD) to create a custom resource (CR)](https://kubernetes.io/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/) in an extension, and use the `RoleTemplate` resource type introduced in this section to customize access control. In the KubeSphere web console, you can customize access control to create roles and grant roles to users, so that only users with specific roles are allowed to access custom resources of extensions. -->

`RoleTemplate` is a CRD provided by KubeSphere for declaring permission items. A permission item is the smallest unit of permission control, which is often used to define access permissions for a specific type of resource. Roles at different resource levels are composed of permissions. Based on permission items, users can flexibly create custom roles to achieve fine-grained access control.

In the Kubesphere user interface, users usually want to get other resources associated with the current resources they get. Place the permissions of a group of closely-related resources in a RoleTemplate to meet the usage requirements on the user interface.

**Permission items of platform roles:**

![global-role](global-role.png?width=1200px)

**Permission items of workspace roles:**

![workspace-role](workspace-role.png?width=1200px)

**Permission items of cluster roles:**

![cluster-role](cluster-role.png?width=1200px)

**Permission items of project roles:**

![project-role](project-role.png?width=1200px)

### RoleTemplate examples

Assume that CRD `custom-resource` `custom-resource-version` is defined in the extension. We expect that it returns custom-resource-version when KubeSphere users view custom-resource in the user interface. The following YAML files create two custom permissions: `global-custom-resource-view` and `global-custom-resource- manage`, respectively authorizing users to view and create resources in the `custom-resource` type, where `global-custom-resource-manage ` depends on `global-custom-resource-view`.

```yaml
apiVersion: iam.kubesphere.io/v1beta1
kind: RoleTemplate
metadata:
  name: global-custom-resource-view
  labels:
    iam.kubesphere.io/category: custom-resource-management
    iam.kubesphere.io/scope: global
    kubesphere.io/managed: 'true'
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

---
apiVersion: iam.kubesphere.io/v1beta1
kind: RoleTemplate
metadata:
  name: global-custom-resource-manage
  annotations:
    iam.kubesphere.io/dependencies: global-custom-resource-view
  labels:
    iam.kubesphere.io/category: custom-resource-management
    iam.kubesphere.io/scope: global
    kubesphere.io/managed: 'true'
spec:
  displayName:
    en: Custom Resource Management
  rules:
    - apiGroups:
        - custom-api-group
      resources:
        - custom-resource
        - custom-resource-version
      verbs:
        - '*'
```

#### RoleTemplate parameters

The following content describes how to configure parameters for custom permissions.

* `apiVersion`: the API version for KubeSphere access control. The current version is `iam.kubesphere.io/v1beta1`.
* `kind`: the resource type of the custom permission. set the value to `RoleTemplate`.
* `metadata`: the metadata of the custom permission.
  * `name`: the resource name of the custom permission.
  * `annotations`:
     * `iam.kubesphere.io/dependencies`: it will be displayed as a dependency on the Console, and when this permission item is selected, the dependent permission item will be automatically selected.
     * `iam.kubesphere.io/role-template-rules`: it controls the permission rules of the Console, see [Permission control on the frontend of Console](./#permission-control-on-the-frontend-of-console) below.
  * `labels`:
    * `iam.kubesphere.io/scope`: the resource label of custom permissions. KubeSphere divides permissions into platforms, clusters, workspaces and project permissions. `global` indicates that the current permission is at the platform level. The value can be `global`, `cluster`, `workspace` and `namespace`.
    * `iam.kubespere.io/category: custom-resource-management`: mark the category of the permission item.
    * `iam.kubespere.io/managed`: indicates whether the permission item is managed by KubeSphere.
* `spec`
  * `displayName`: the display name of the custom permission, which supports i18n.
    * `en`: display name in English.
    * `zh`: display name in Chinese.
  * `rules`: the resources and operations allowed by the custom permission. This parameter is the actual definition of the content of custom permissions.
    * `apiGroups`: the API group to which the resource type belongs. The value `*` indicates all API groups.
    * `resources`: the resource type authorized to users, which can be CRD (for instance, `custom-resource`, `custom-resource-version` in the examples in this section) or a Kubernetes default resource type (such as `deployment`). The value `*` indicates all resource types at the permission level.
    * `verbs`: the operations authorized to the user. The value `*` indicates all operations at the permission level. For more information about resource types, see [Kubernetes official documentation](https://kubernetes.io/docs/reference/access-authn-authz/authorization/).

### Automatic aggregation of RoleTemplates

Aggregate RoleTemplates into roles using label matching method. The role contains a field called `aggregationRoleTemplates`, which includes a `roleSelector` field used to match the labels of RoleTemplates. RoleTemplates that match successfully are automatically aggregated into the role.

```yaml
apiVersion: iam.kubesphere.io/v1beta1
kind: GlobalRole
metadata:
  annotations:
    ## Add this annotation to enable automatic aggregation
    iam.kubesphere.io/auto-aggregate: "true"
  name: authenticated
aggregationRoleTemplates:
  roleSelector:
    matchLabels:
      iam.kubesphere.io/aggregate-to-authenticated: ""
      iam.kubesphere.io/scope: "global"
rules:
 ......
```

To aggregate a RoleTemplate into the "authenticated" GlobalRole mentioned above, you can add a specific label to the RoleTemplate. For example, add `iam.kubesphere.io/aggregate-to-authenticated: ''` to the RoleTemplate.

```yaml
apiVersion: iam.kubesphere.io/v1beta1
kind: RoleTemplate
metadata:
  name: global-custom-resource-manage
  annotations:
    iam.kubesphere.io/dependencies: global-custom-resource-view
  labels:
    iam.kubesphere.io/category: custom-resource-management
    ## Make sure the scope matches the role being aggregated
    iam.kubesphere.io/scope: global
    ## Aggregate to the built-in role "authenticated"
    iam.kubesphere.io/aggregate-to-authenticated: '' 
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

Most built-in roles support automatic aggregation, reducing the configuration work for users.

For `admin` roles at different levels, they can automatically aggregate all RoleTemplates within their respective levels. For example, an admin of a namespace can automatically aggregate all RoleTemplates with the  scope being "namespace".

For `non-admin` roles, you can use the following labels to aggregate them to the corresponding roles:

#### Workspace
- iam.kubesphere.io/aggregate-to-viewer: ""
- iam.kubesphere.io/aggregate-to-regular: ""
- iam.kubesphere.io/aggregate-to-self-provisioner: ""

#### Global
- iam.kubesphere.io/aggregate-to-authenticated: ""

#### Cluster
- iam.kubesphere.io/aggregate-to-cluster-viewer: ""

#### Namespace
- iam.kubesphere.io/aggregate-to-operator: ""
- iam.kubesphere.io/aggregate-to-viewer: ""

### Category

Category is used to mark the category of RoleTemplate. KubeSphere Console displays permission items in groups according to their categories, which correspond to the labels of RoleTemplate: `iam.kubesphere.io/category: custom-resource-management`。

```yaml
apiVersion: iam.kubesphere.io/v1beta1
kind: Category
metadata:
  name: custom-resource-management
  labels:
    iam.kubesphere.io/scope: global
    kubesphere.io/managed: 'true'  
spec:
  displayName:        
    en: Custom Resource Management
```

#### Category parameters

 * `apiVersion`: the API version for KubeSphere access control.  The current version is `iam.kubesphere.io/v1beta1`.
 * `kind`: the resource type of the custom permission. Set the parameter value to `Category`.
 * `metadata`: the metadata for the custom permission.
   * `name`: the resource name of the custom permission.
   * `labels`:
     * `iam.kubesphere.io/scope`: the resource label of custom permissions. KubeSphere divides permissions into platforms, clusters, workspaces and project permissions. `global` indicates that the current permission is at the platform level. The value can be `global`, `cluster`, `workspace` and `namespace`.
    * `spec`
      * `displayName`: the display name of the custom permission, which supports i18n.
        * `en`: display name in English.
        * `zh`: display name in Chinese.

### Create custom roles

After declaring RoleTemplate and Category, create custom roles:

![custom-role-template](custom-role-template.png)

## Permission control on the frontend of Console

For the frontend, the RoleTemplate is crucial as it determines whether a page or button should be rendered when rendering pages for different tenants. The specific mechanism is as follows:

1. First, get the roles associated with a user at various levels (global role, cluster role, workspace role, role).

2. Based on the `aggregationRoleTemplates` field of these roles, retrieve all RoleTemplates.

3. Determine whether to render a page or button based on all the obtained RoleTemplates.

When entering a page, whether to render a specific page or button is determined based on RoleTemplates at different levels in the following order: global > cluster > workspace > namespace. If a higher-level RoleTemplate already includes the required permission items, the RoleTemplates at lower levels will not be checked.

Therefore, when developing interactive functionality for an extension, you need to consider the permission scope of tenants and what operations they are allowed to perform.

Menu Permission Settings

  ```JavaScript
  // menu relates to permission fields
  const menu = { 
  name: 'hello-world',         // name is required
  ksModule: 'hello-world',    
  authKey: 'hello-world',  
  authAction:'view',   
  skipAuth: true,      
};
  ```
Permission Filtering Effect

|   | Permissions                         | Fields                  | Type        | Description                                 |
|---|----------------------------|---------------------|-----------|------------------------------------|
| 1 | Whether it is the platform administrator (platform-admin) | `admin` | `boolean` | If set to `true`, non-platform administrators will not be displayed. The default value is `false`. |
| 2 | Whether the module is installed in the current cluster | `clusterModule` | `string` | If not installed in the current cluster, it will not be displayed. Multiple modules can be specified using `\|` as a separator. |
| 3 | Whether the module is installed or not | `ksModule` |  `string`  | Uninstalled modules are not displayed. |
| 4 | Whether the module is installed and has a specified `annotation` value | `annotation` | `string` | Modules without a specified `annotation` value will not be displayed. Note: `annotation` must be used in conjunction with `ksModule`. |
| 5 | Filter by permissions                   | `authKey` or `name` | `string`  | If there is `authKey`, take `authKey`, otherwise take `name`. |
| 6 | Filter by permission items                    | `authAction`        | `string`  | The default value is `view`. |
| 7 | Skip permission control                     | `skipAuth`          | `boolean` | It has the highest priority, if set to `true`, other configurations can be ignored.             |

* RoleTemplate frontend permission control

```yaml
metadata:
  annotations:
    iam.kubesphere.io/role-template-rules: '{"pipelines":"view"}'
    iam.kubesphere.io/role-template-rules: '{"pipelines":"manage"}'
```
* Parameters of RoleTemplate frontend permission control

    * `iam.kubesphere.io/role-template-rules`: control the annotations of frontend permissions, `{key: action }` is a JSON string.
    * `{key}`: the key of the frontend permission, corresponding to the `authKey` or `name` field of the frontend permission.
    * `{action}`: see Actions of RoleTemplate frontend permission control.

* Actions for RoleTemplate frontend permission control
    * `view`: with this field, the corresponding menus and pages are displayed. However, it only offers view permission, no operation permission.
    * `*`, `manage`: view and operation permissions.
    * `create`: create permission.
    * `delete`: delete permission.
    * `edit`: edit permission.
    * Other custom values (with frontend hardcoding).
  > Note: `create`, `delete`, `edit` are frontend permissions, they should work with the frontend code to add code such as `action: 'create'` on the corresponding button, as in the following example.

 ```JavaScript
  // Code snippets
  import { useActionMenu, DataTable } from '@ks-console/shared';}
  const renderTableAction = useActionMenu({
    autoSingleButton: true,
    authKey,
    params,
    actions: [
      {
        key: 'invite',
        text: t('INVITE'),
        action: 'create',  //It should be a specified action 
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
