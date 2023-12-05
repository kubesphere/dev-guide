---
title: 打包扩展组件
weight: 01
description: 如何打包 KubeSphere 扩展组件
---

扩展组件开发完成之后，需要遵循 Helm 规范对扩展组件进行编排。

## 初始化扩展组件包

使用 `ksbuilder create` 创建扩展组件包（Helm Chart）。

```text
➜  extension-samples git:(master) cd extensions
➜  extensions git:(master) ksbuilder create   
Please input extension name: hello-world
✔ other
Please input extension author: hongming
Please input Email (optional): hongming@kubesphere.io
Please input author's URL (optional): 
Directory: /Users/hongming/GitHub/extension-samples/extensions/hello-world
```

使用 [Helm](https://helm.sh/zh/docs/topics/charts/) 对扩展组件进行编排，扩展组件包的目录结构：

```text
├── README.md
├── README_zh.md
├── charts             # 扩展组件的子 Chart，通常前后端扩展分为两个部分
│   ├── backend        # 扩展组件支持多集群调度，多集群模式下需要添加 agent tag
│   │   ├── Chart.yaml
│   │   ├── templates  # 模板文件
│   │   │   ├── NOTES.txt
│   │   │   ├── deployment.yaml
│   │   │   ├── extensions.yaml
│   │   │   ├── helps.tpl
│   │   │   └── service.yaml
│   │   └── values.yaml
│   └── frontend       # 前端扩展需要在 host 集群中部署，需要添加 extension tag
│       ├── Chart.yaml
│       ├── templates  # 模板文件
│       │   ├── NOTES.txt
│       │   ├── deployment.yaml
│       │   ├── extensions.yaml
│       │   ├── helps.tpl
│       │   └── service.yaml
│       └── values.yaml
├── extension.yaml     # extension 元数据声明文件
├── permissions.yaml   # 扩展组件安装时说需要的资源授权
├── static             # 静态资源文件
│   ├── favicon.svg
│   └── screenshots
│       └── screenshot.png
└── values.yaml        # 扩展组件配置
```

### extension.yaml 的定义

`extension.yaml` 文件中包含了扩展组件的元数据信息：

```yaml
apiVersion: v1
name: employee               # 扩展组件的名称（必填项）
version: 0.1.0               # 扩展组件的版本，须符合语义化版本规范（必填项）
displayName:                 # 扩展组件展示时使用的名称（必填项），Language Code 基于 ISO 639-1
  zh: 示例扩展组件
  en: Sample Extension
description:                 # 扩展组件展示时使用的描述（必填项）
  zh: 这是一个示例扩展组件，这是它的描述
  en: This is a sample extension, and this is its description
category: devops             # 扩展组件的分类（必填项）
keywords:                    # 关于扩展组件特性的一些关键字（可选项）
  - others
home: https://kubesphere.io  # 项目 home 页面的 URL（可选项）
sources:                     # 项目源码的 URL 列表（可选项）
  - https://github.com/kubesphere
kubeVersion: ">=1.19.0"      # 扩展组件兼容的 Kubernetes 版本限制（可选项）
ksVersion: ">=3.0.0"         # 扩展组件兼容的 KubeSphere 版本限制（可选项）
maintainers:                 # 扩展组件维护者（可选项）
  - name: "ks"
    email: "ks@kubesphere.io"
    url: "https://www.kubesphere.io"
provider:                    # 扩展组件提供商（必填项）
  zh:
    name: "青云科技"
    email: "ks@kubesphere.io"
    url: "https://www.qingcloud.com"
  en:
    name: "QingCloud"
    email: "ks@kubesphere.io"
    url: "https://www.qingcloud.com"
staticFileDirectory: static  # 扩展组件静态文件存放目录，图标和 README 引用的静态文件等需存放到该目录（必填项）
icon: ./static/favicon.svg   # 扩展组件展示时使用的图标，可以定义为本地的相对路径（必填项）
screenshots:                 # 扩展组件截图（可选项）
  - ./static/screenshots/screenshot.png
dependencies:                # 扩展组件依赖的 Helm Chart，语法与 Helm 的 Chart.yaml 中 dependencies 兼容（可选项）
  - name: extension
    tags:
      - extension
  - name: apiserver
    tags:
      - agent
# 扩展组件的安装模式，它可以是 HostOnly 或 Multicluster。
# HostOnly 模式下，扩展组件只会被安装到 host 集群。
# Multicluster 模式下 tag 中带有 agent  的 subchart 可以选择集群进行部署。    
installationMode: HostOnly
# 对其它扩展组件的依赖（可选项）
# externalDependencies:       
#   - name: a
#     type: extension
#     version: ">= 2.6.0"
#     required: true
#   - name: b
#     type: extension
#     version: ">= 2.2.0"
#     required: true
```

扩展组件包名(name)作为扩展组件的唯一标识，需要遵循以下规则：

1. 包名只能包含小写字母、数字。
2. 最大长度 32 个字符。
3. 包名应该具有全球唯一性，以确保不与其他应用程序的包名发生冲突。

displayName、description 和 provider 字段支持国际化，Language Code 基于 [ISO 639-1][iso-639-1]，当浏览器、用户语言都无法匹配时，`en` 会作为的默认的语言区域。

扩展组件包是一个 Main Chart，可以在 KubeSphere 管理的集群中进行部署。通常扩展组件会被分为前端扩展和后端扩展两个部分，扩展组件支持多集群部署时，需要分别给前端扩展 Sub Chart 和后端扩展 Sub Chart（在 extension.yaml中）添加 `extension` 和 `agent` tag。前端扩展只会被部署到 host 集群，后端扩展允许选择集群进行调度。

## 编排扩展组件

前端扩展请参考 [UI 扩展][ui-extension]，后端扩展请参考 [API 扩展][api-extension]

Helm Chart 编排规范及最佳实践请参考 <https://helm.sh/docs/>

扩展组件可以使用的全局参数：

| 参数                           | 说明                                     |
| ------------------------------ | ---------------------------------------- |
| `global.clusterInfo.name`      | 扩展组件安装所在的集群名称                |
| `global.clusterInfo.role`      | 扩展组件安装所在的集群角色                |
| `global.imageRegistry`          | 全局配置镜像仓库地址                     |

扩展组件的编排过程中需要遵循以下规则：

1. 兼容 KubeSphere 的全局配置参数，比如全局的仓库地址，可以避免用户手动调整参数出错的概率。
2. 子Chart尽可能引用本地文件而非远端URL，避免网络问题导致扩展组件无法正确加载。

### permissions.yaml 的定义

`permissions.yaml` 定义了扩展组件安装时所需要的资源授权：

```yaml
kind: ClusterRole
rules:  # 如果你的扩展组件需要创建、变更 Cluster 级别的资源，你需要编辑此授权规则
  - verbs:
      - 'create'
      - 'patch'
      - 'update'
    apiGroups:
      - 'extensions.kubesphere.io'
    resources:
      - '*'

---
kind: Role
rules:  # 如果你的扩展组件需要创建、变更 Namespace 级别的资源，你需要编辑此授权规则
  - verbs:
      - '*'
    apiGroups:
      - ''
      - 'apps'
      - 'batch'
      - 'app.k8s.io'
      - 'autoscaling'
    resources:
      - '*'
  - verbs:
      - '*'
    apiGroups:
      - 'networking.k8s.io'
    resources:
      - 'ingresses'
      - 'networkpolicies'
```

在定义扩展组件安装所需的资源授权时需要遵循以下规则：

1. 尽可能减少不必要的权限，只读权限够用就不要申请编辑创建权限，编辑创建权限够用就不要申请删除资源的权限。
2. 尽可能不要申请敏感权限，clusterrolebinding，rolebinding，secret，muutatingwebhookconfiguration 和 validatingwebhookconfiguration 等敏感资源的访问权限需要有明确的理由。
3. 能通过 resourceNames 限制资源范围的权限项不要使用通配符('*')。

相关文档：

1. <https://kubernetes.io/docs/reference/access-authn-authz/rbac/>
2. <https://helm.sh/docs/topics/rbac/>

## 扩展组件打包

可以直接从 GitHub 上克隆 hello-world 这个示例扩展组件的安装包。

```bash
git clone https://github.com/kubesphere/extension-samples.git
```

使用 `ksbuilder package` 命令可以将编排好的扩展组件进行打包为压缩文件，便于分发。

```bash
➜  extension-samples git:(master) ✗ cd extensions
➜  extensions git:(master) ✗ ksbuilder package hello-world    
package extension hello-world
package saved to /Users/hongming/GitHub/extension-samples/extensions/hello-world-0.1.0.tgz
```

接下来您可以参考[测试扩展组件](../testing)，将扩展组件提交到扩展市场中部署测试。

[ui-extension]: ../../feature-customization/extending-ui/
[api-extension]: ../../feature-customization/extending-api/
[iso-639-1]: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
