---
title: Package Extensions
weight: 1
description: "Describes how to package extensions."
---

After completing the extension development, follow Helm specifications to orchestrate the extension.

## Initialize the extension package

Use `ksbuilder create` to create the extension package (Helm Chart).

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

Orchestrate your extension using [Helm](https://helm.sh/zh/docs/topics/charts/), and the directory structure of the extension package is as follows:

```text
├── README.md
├── README_zh.md
├── charts             # Sub-charts of the extension, usually divided into backend and frontend parts
│   ├── backend        # If the extension supports multi-cluster scheduling, an agent tag needs to be added in the multi-cluster mode
│   │   ├── Chart.yaml
│   │   ├── templates  # template files
│   │   │   ├── NOTES.txt
│   │   │   ├── deployment.yaml
│   │   │   ├── extensions.yaml
│   │   │   ├── helps.tpl
│   │   │   └── service.yaml
│   │   └── values.yaml
│   └── frontend       # The frontend extension needs to be deployed in the host cluster, and an extension tag should be added.
│       ├── Chart.yaml
│       ├── templates  # template files
│       │   ├── NOTES.txt
│       │   ├── deployment.yaml
│       │   ├── extensions.yaml
│       │   ├── helps.tpl
│       │   └── service.yaml
│       └── values.yaml
├── extension.yaml     # Extension metadata declaration file
├── permissions.yaml   # Resource authorization required during extension installation
├── static             # Static resource files
│   ├── favicon.svg
│   └── screenshots
│       └── screenshot.png
└── values.yaml        # Extension configuration

```

### Definition of extension.yaml

`extension.yaml` contains the metadata of the extension:

```yaml
apiVersion: v1
name: employee               # Extension name (required)
version: 0.1.0               # Extension version, which must comply with semantic versioning (required)
displayName:                 # Name used for the display of the extension (required), and the Language Code must be based on ISO 639-1
  zh: 示例扩展组件
  en: Sample Extension
description:                 # Extension description (required)
  zh: 这是一个示例扩展组件，这是它的描述
  en: This is a sample extension, and this is its description
category: devops             # Extension category (required)
keywords:                    # Keywords that describe extension features (optional)
  - others
home: https://kubesphere.io  # URL of the project homepage (optional)
sources:                     # URL list of the source code of the project (optional)
  - https://github.com/kubesphere # Extension repository
docs: https://github.com/kubesphere # Extension documentation
kubeVersion: ">=1.19.0"      # Compatible Kubernetes versions (optional)
ksVersion: ">=3.0.0"         # Compatible KubeSphere versions (optional)
maintainers:                 # Maintainer of the extension (optional)
  - name: "ks"
    email: "ks@kubesphere.io"
    url: "https://www.kubesphere.io"
provider:                    # Provider of the extension (optional)
  zh:
    name: "青云科技"
    email: "ks@kubesphere.io"
    url: "https://www.qingcloud.com"
  en:
    name: "QingCloud"
    email: "ks@kubesphere.io"
    url: "https://www.qingcloud.com"
staticFileDirectory: static  # Directory for storing static files such as icons and static files included in the README file (required)
icon: ./static/favicon.svg   # Icon used for displaying the extension, which can be defined as a relative path to a local file (required)
screenshots:                 # Extension screenshots (optional)
  - ./static/screenshots/screenshot.png
dependencies:                # Helm Chart that the extension relies on, and the syntax must be compatible with that of the dependencies in Helm's Chart.yaml (optional)
  - name: extension
    tags:
      - extension
  - name: apiserver
    tags:
      - agent
# Installation mode for the extension, which can be HostOnly or Multicluster.
# In HostOnly mode, the extension will only be installed on the host cluster.
# In Multicluster mode, subcharts with tags containing 'agent' can be deployed to selected clusters.
installationMode: HostOnly
# Dependencies on other extensions (optional)
# externalDependencies:       
#  - name: a
#    type: extension
#    version: ">= 2.6.0"
#    required: true
#  - name: b
#    type: extension
#    version: ">= 2.2.0"
#    required: true
```

The package name (name), as a unique identifier of the extension, should follow the following rules:

1. The package name should contain only lowercase letters, and numbers. 
2. The maximum length is 32 characters. 
3. The package name should be globally unique to ensure that it does not conflict with other applications. 

The displayName, description, and provider fields support internationalization, and the Language Code is based on [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes). When the browser and user languages do not match, `en` will be used as the default locale.

The extension package is a Main Chart that can be deployed in clusters managed by KubeSphere. Typically, the extension is divided into two parts: frontend extension and backend extension. When the extension supports multi-cluster deployment, the `extension` and `agent` tags need to be added separately to the frontend extension Sub Chart and backend extension Sub Chart (in extension.yaml). The frontend extension will only be deployed to the host cluster, while the backend extension allows for selection of clusters for scheduling.

## Orchestrate extensions

Refer to [UI Extension](../../feature-customization/extending-ui/) for frontend extension and [API Extension](../../feature-customization/extending-api/) for backend extension.

For Helm Chart orchestration specifications and best practices, please refer to <https://helm.sh/docs/>.

Global parameters available for extensions:

| Parameter                  | Description                                       |
|-------------------------|---------------------------------------------------|
| `global.clusterInfo.name`| The name of the cluster where the extension is installed. |
| `global.clusterInfo.role`| The role of the cluster where the extension is installed.  |
| `global.imageRegistry`| Image registry address for global configuration. |

The orchestration process of extensions should follow the following rules:

1. Compatible with KubeSphere's global configuration parameters, such as the global repository address, to reduce the probability of users manually adjusting parameters incorrectly.
2. Whenever possible, subcharts should reference local files rather than remote URLs to avoid network issues that loading the extension failed.


### Definition of permissions.yaml

`permissions.yaml` defines the resource authorization required for extension installation:

```yaml
kind: ClusterRole
rules:  # Edit this rule if your extension needs to create and change cluster resources.
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
rules:  # Edit this rule if your extension needs to create and change namespace resources.
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
When defining the resource authorizations required for extension installation, you should follow the following rules:

1. Minimize unnecessary permissions as much as possible. If read-only permissions are sufficient, do not request edit or create permissions. If edit or create permissions are sufficient, avoid requesting permissions to delete resources.
2. Avoid requesting sensitive permissions whenever possible. Clear reasons are required for accessing sensitive resources such as clusterrolebinding, rolebinding, secret, mutatingwebhookconfiguration, and validatingwebhookconfiguration.
3. Avoid using wildcards ('*') in permission items where resource scope can be limited through resourceNames.

Reference:

1. https://kubernetes.io/docs/reference/access-authn-authz/rbac/
2. https://helm.sh/docs/topics/rbac/


## Package the extension

Clone the installation package of the example extension "hello-world" from GitHub.

```bash
git clone https://github.com/kubesphere/extension-samples.git
```

Use the `ksbuilder package` command to package the orchestrated extension into a compressed file for distribution.

```bash
➜  extension-samples git:(master) ✗ cd extensions
➜  extensions git:(master) ✗ ksbuilder package hello-world    
package extension hello-world
package saved to /Users/hongming/GitHub/extension-samples/extensions/hello-world-0.1.0.tgz
```

Next, you can refer to [Test Extensions](../testing) to submit the extension to the KubeSphere Marketplace for deployment and testing.

[ui-extension]: ../../feature-customization/extending-ui/
[api-extension]: ../../feature-customization/extending-api/
[iso-639-1]: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes