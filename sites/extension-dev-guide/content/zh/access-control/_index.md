---
title: 访问控制
weight: 05
description: "访问控制"
---

## 用户对接

可以通过上文中的`oauth`或`iframe 消息` 的方式拿到登录信息

建议将`admin`用户(超管)也映射到扩展的超管,普通用户则调用自身api创建一个普通用户(无权限), 再由超管用户手动分配权限, 用户点击扩展入口时, 通过映射好的用户直接进入界面, 跳过登录(代码帮忙登录)

> 如何保证iframe传过来的用户是可信的

可以访问一下`http://192.168.50.218:30880/oauth/userinfo`这个接口, 结果如下

```json
{
"sub": "admin",
"name": "admin",
"email": "admin@kubesphere.io",
"preferred_username": "admin"
}
```

## 深度权限集成(可选)

### 后端api代理

将应用的后端代码也使用ks的代理实现, 这样就可以通过ks的ui配置权限, 实现特定的路由与资源是否允许增删改查

> 注意!!  需要前后端的路由改造, 路由规则满足如下几种, 如您的代码无法修改请跳过本章节

- 平台作用域的 （`(apis/kapis)/GROUP/VERSION/*`）

- 集群作用域的（`/clusters/CLUSTER/(apis/kapis)/GROUP/VERSION/*`）

- 企业空间作用域的 （`(apis/kapis)/GROUP/VERSION/workspaces/WORKSPACE/*`）

- 名字空间作用域的（`/clusters/CLUSTER/(apis/kapis)/GROUP/VERSION/namespaces/NAMESPACE/*`）

#### KubeSphere 中的访问控制

KubeSphere 是一个支持多租户的容器管理平台，与 Kubernetes 相同，KubeSphere 通过基于角色的访问控制（RBAC）对用户的权限加以控制，实现逻辑层面的资源隔离。

KubeSphere 中的资源被划分为平台、企业空间、集群、项目四个层级，所有的资源都会归属到这四个资源层级之中，各层级可以通过角色来控制用户的资源访问权限。

**平台角色：** 主要控制用户对平台资源的访问权限，如集群的管理、企业空间的管理、平台用户的管理等。

**企业空间角色：** 主要控制企业空间成员在企业空间下的资源访问权限，如企业空间下项目、企业空间成员的管理等。

**项目角色：** 主要控制项目下资源的访问权限，如工作负载的管理、流水线的管理、项目成员的管理等。

<img src="../image/rbac.png?width=900px" alt="rbac" style="zoom:50%;" />

#### RoleTemplate 示例

`RoleTemplate` 是由 KubeSphere 提供的 CRD， 用于声明权限项，是 KubeSphere UI 中最小的权限分割单元，通常用来定义某一类型资源的访问权限。各资源层级中的角色都由权限组合而成，基于权限项，用户可以灵活地创建自定义角色，实现精细的访问控制。

假设扩展组件中定义了 CRD `custom-resource`, 以下 YAML 文件创建了 `global-custom-resource-viewing` 和 `global-custom-resource-creation` 两个自定义权限，分别授权用户查看和创建 `custom-resource` 类型的资源，其中 `global-custom-resource-creation` 依赖于 `global-custom-resource-viewing`。

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
      verbs:
        - '*'
```

**RoleTemplate 参数说明**

以下介绍如何设置自定义权限的参数。

* `apiVersion`：KubeSphere 访问控制 API 的版本。当前版本为 `iam.kubesphere.io/v1beta1`。
* `kind`：自定义权限的资源类型。请将参数值设置为 `RoleTemplate`。
* `metadata`：自定义权限的元数据。
  * `name`：自定义权限的资源名称。
  * `annotations`：
    * `iam.kubesphere.io/dependencies`: 在 Console 中会显示为依赖关系，当选中这个权限项时会自动选中依赖的权限项。
    * `iam.kubesphere.io/role-template-rules`: 具体控制 Console 权限规则，相见下文 [Console 前端权限控制](../image/#console-前端权限控制)。
  * `labels`：
    * `iam.kubesphere.io/scope`：自定义权限的资源标签。KubeSphere 将权限分为平台、集群、企业空间和项目权限。取值 `global` 表示当前权限为平台级别的权限。可选的值有 `global`、`cluster`、`workspace` 和 `namespace`。
    * `iam.kubespere.io/category`：标记权限项所属的类别。
    * `iam.kubespere.io/managed`：KubeSphere 管理的授权项。
* `spec`
  * `displayName`：显示名称，支持国际化
    * `en`：英文显示名称。
    * `zh`：中文显示名称。
  * `rules`：自定义权限向用户授权的资源和操作。此参数为自定义权限内容的实际定义。
    * `apiGroups`：向用户授权的资源类型所属的 API 组。取值 `'*'` 表示当前权限级别的所有 API 组。
    * `resources`：向用户授权的资源类型，可以为 CRD（例如本节示例中的 `custom-resource`，`custom-resource-version`）或 Kubernetes 默认资源类型（例如 `deployment`）。取值 `'*'` 表示当前权限级别的所有资源类型。
    * `verbs`：向用户授权的操作。取值 `'*'` 当前权限级别的所有操作。有关资源操作类型的更多信息，请参阅 [Kubernetes 官方文档](https://kubernetes.io/docs/reference/access-authn-authz/authorization/)。

#### Category

Category 用于标记 RoleTemplate 所属的类别。KubeSphere Console 将根据权限项的类别将权限项分组显示。对应 RoleTemplate 的 label `iam.kubesphere.io/category: custom-resource-management`。

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

Category 参数说明

* `apiVersion`：KubeSphere 访问控制 API 的版本。当前版本为 `iam.kubesphere.io/v1beta1`。
* `kind`：自定义权限的资源类型。请将参数值设置为 `Category`。
* `metadata`：自定义权限的元数据。
  * `name`：自定义权限的资源名称。
  * `labels`：
    * `iam.kubesphere.io/scope`：自定义权限的资源标签。KubeSphere 将权限分为平台、集群、企业空间和项目权限。取值 `global` 表示当前权限为平台级别的权限。可选的值有 `global`、`cluster`、`workspace` 和 `namespace`。
    * `spec`
      * `displayName`：显示名称，支持国际化
        * `en`：英文显示名称。
        * `zh`：中文显示名称。

#### 自定义角色创建

声明 RoleTemplate、Category 后，创建自定义角色：

![custom-role-template](../image/custom-role-template.png)

配置好角色后, 给一个用户添加这个角色

#### 添加后端代理

```yaml
apiVersion: extensions.kubesphere.io/v1alpha1
kind: APIService
metadata:
  name: demo
spec:
  group: custom-api-group
  version: v1alpha1                                      
  url: http://demo-service.default.svc.cluster.local:8080
# caBundle: <Base64EncodedData>
# insecureSkipTLSVerify: false

# service:
#   namespace: example
#   name: apiserver
#   port: 443
status:
  state: Available
```

| 字段                                                    | 描述                                                         |
| :------------------------------------------------------ | :----------------------------------------------------------- |
| `spec.group` `spec.version`                             | 创建 APIService 类型的 CR 会向 ks-apiserver 动态注册 API，其中`spec.group`、`spec.version`表示所注册的 API 路径中的 API Group 与 API Version |
| `spec.url` `spec.caBundle` `spec.insecureSkipTLSVerify` | 为 APIService 指定外部服务，将 API 请求代理到指定的 endpoint |
| `spec.service`                                          | 与 `spec.url` 类似，为 API 指定 K8s 集群内部的服务引用地址   |

> 通过 `spec.service` 定义后端的 endpoint 默认需要启用 TLS，如需指定 HTTP 服务地址，需要通过 `spec.url` 显式指定 scheme 为 `http`。

如果这个角色只分配了view权限, 那么当他请求后端路由`custom-api-group/v1alpha1/custom-resource`的`post`等写权限方法时就会被阻止 

### Console 前端权限控制

> 前端不太熟, 这块没仔细修改 @安冬奕

menu 权限设置

```JavaScript
// menu 涉及权限字段
const menu = { 
  name: 'hello-world',     // name 必填字段
  ksModule: 'hello-world',    
  authKey: 'hello-world',  
  authAction:'view',   
  skipAuth: true,      
};
```

权限过滤效果

|      | 权限                                         | 字段                | 类型      | 说明                                                         |
| ---- | -------------------------------------------- | ------------------- | --------- | ------------------------------------------------------------ |
| 1    | 是否为平台管理员角色(platform-admin)         | `admin`             | `boolean` | 为 `true` 则非平台管理员不显示, 默认值 `false`               |
| 2    | 根据模块是否在当前集群中安装过滤             | `clusterModule`     | `string`  | 在当前集群中未安装不显示,可以指定多个模块使用 `\|` 进行分割  |
| 3    | 根据模块是否安装过滤                         | `ksModule`          | `string`  | 未安装模块不显示                                             |
| 4    | 根据模块是否安装并给了指定`annotation`值过滤 | `annotation`        | `string`  | 模块没有指定`annotation`值不显示。注意: `annotation` 必须配合 `ksModule` 一起使用 |
| 5    | 根据配置权限过滤                             | `authKey` or `name` | `string`  | 有 `authKey` 取 `authKey`，否则取 `name`                     |
| 6    | 根据配置权限项                               | `authAction`        | `string`  | 默认值 `view`                                                |
| 7    | 跳过权限控制                                 | `skipAuth`          | `boolean` | 优先级最高，为 `true` 则忽略其他配置                         |

* RoleTemplate 前端权限控制

```yaml
metadata:
  annotations:
    iam.kubesphere.io/role-template-rules: '{"pipelines":"view"}'
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
  * 其他自定义值（配合前端硬编码）。

  > 注：`create`、`delete`、`edit` 为前端权限，需配合前端代码，在对应操作的按钮上添加类似 `action: 'create'` 代码，下例。

```JavaScript
import { useActionMenu, DataTable } from '@ks-console/shared';
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

### 针对 CRD 的 API 扩展

如果您已经借助 K8s CRD 定义了 API，在 KubSphere 中可以直接使用 K8s 提供的 API。此外，还可以利用 KubeSphere 增强您的 API。

#### 多集群

通过 KubeSphere host 集群的 ks-apiserver 可以代理访问各 member 集群的资源，API 模式如下： `/clusters/{cluster}/apis/{group}/{version}/{resources}`

通过 `/clusters/{cluster}` 前缀可以指定访问特定集群中的资源。

#### 访问控制

KubeSphere API 支持多级访问控制，需要在 API 路径设计上严格遵循[KubeSphere API 的设计模式](../../references/kubesphere-api-concepts/)。用户访问权限往往需要与前端联动，请参考[访问控制](../access-control/)章节。

#### 分页与模糊搜索

为 CRD 添加 Label `kubesphere.io/resource-served: 'true'`，KubeSphere 会为相关的 CR 资源提供分页和模糊查询 API 等功能。

> 如果使用了相同的 API Group 与 API Version，APIService 的优先级高于 KubeSphere Served Resource API。

**请求示例与参数说明：**

集群资源：`GET /clusters/{cluster}/kapis/{apiGroup}/{apiVersion}/{resources}`

企业空间资源：`GET /clusters/{cluster}/kapis/{apiGroup}/{apiVersion}/workspaces/{workspace}/{resources}`

命名空间资源：`GET /clusters/{cluster}/kapis/{apiGroup}/{apiVersion}/namespaces/{namespace}/{resources}`


| 查询参数         | 描述                                             | 是否必须 | 默认值               | 备注                                                                                                                            |
|----------------|------------------------------------------------|------|-------------------|-------------------------------------------------------------------------------------------------------------------------------|
| page           | 页码                                             | 否    | 1                 |                                                                                                                               |
| limit          | 页宽                                             | 否    | -1                |                                                                                                                               |
| sortBy         | 排序字段，支持 name, createTime,creationTimestamp     | 否    | creationTimestamp |                                                                                                                               |
| ascending      | 升序                                             | 否    | false             |                                                                                                                               |
| name           | 资源名，支持模糊搜索                                     | 否    |                   |                                                                                                                               |
| names          | 资源名集合，多个用英文逗号分开                                | 否    |                   |                                                                                                                               |
| uid            | 资源 uid                                         | 否    |                   |                                                                                                                               |
| namespace      | namespace                                      | 否    |                   |                                                                                                                               |
| ownerReference | ownerReference                                 | 否    |                   |                                                                                                                               |
| ownerKind      | ownerKind                                      | 否    |                   |                                                                                                                               |
| annotation     | 注解，支持‘=’, '!='，单个annotation，键值对或单个键            | 否    |                   | annotation=ab=ok或annotation=ab                                                                                                |
| labelSelector  | 标签选择器，用法与 K8s labelSelector 一样，参考[labels#api](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#api) | 否    |     |  labelSelector=environment in (production,qa),tier in (frontend) |
| fieldSelector  | 属性选择器，支持'=', '==', '!='，多个用英文逗号分隔，从根开始查询所有路径属性 <br/>支持大小写不敏感，需给值加上前缀`~` | 否   |     | fieldSelector=spec.ab=true,spec.bc!=ok    <br/> 大小写不敏感：fieldSelector=spec.ab=~ok,spec.bc!=~ok |        

**响应：**

```json
{
    "apiVersion":"{Group}/{Version}",
    "items":[],
    "kind":"{CR}List",
    "metadata":{
        "continue":"",
        "remainingItemCount":0, 
        "resourceVersion":""
    }
}
```