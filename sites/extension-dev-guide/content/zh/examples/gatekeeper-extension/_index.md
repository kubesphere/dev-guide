---
title: Gatekeeper
weight: 01
description: 集成 Gatekeeper
---

本章节将以 Gatekeeper 为例，介绍如何将 Helm Chart 迁移到 KubeSphere 平台作为扩展组件。

本示例不涉及对 KubeSphere UI 的扩展，将 Gatekeeper 的 Helm Chart 转换为 KubeSphere 的扩展组件之后就可以通过 KubeSphere 的扩展组件商店，将其安装部署到 KubeSphere 纳管的集群之中，进行统一的管理。

本示例的源代码：<https://github.com/kubesphere-extensions/gatekeeper/tree/master/charts/gatekeeper>

#### Gatekeeper 是什么

[Open Policy Agent (OPA)](https://github.com/open-policy-agent/opa) 是一种开源通用策略引擎，可统一整个堆栈中的策略实施。OPA 提供了一种高级声明性语言，让我们可以通过简单的代码定义策略。

Gatekeeper 是一个基于 OPA 构建在 [K8s admission webhook](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/) 机制之上的安全策略管理工具，能够在不牺牲开发敏捷性和操作独立性的前提下确保集群的安全合规。

例如，可以在 K8s 集群中执行以下策略：

* 所有的容器镜像必须来自可信的镜像仓库。
* 所有 ingress 的 host name 必须是全局唯一的。
* 所有的 pod 必须配置 limit 和 request。
* 不允许挂载 host path。

OPA 社区已经提供了 Gatekeeper 的 [Helm Chart](https://github.com/open-policy-agent/gatekeeper/tree/master/charts/gatekeeper)，我们可以通过以下步骤将其快速集成到 KubeSphere 扩展商店之中。

#### 使用 ksbuilder 创建扩展组件包

```bash
➜  charts git:(master) ksbuilder create
Please input extension name: gatekeeper
✔ security
Please input extension author: hongming
Please input Email (optional): hongming@kubesphere.io
Please input author's URL (optional): 
Directory: /Users/hongming/GitHub/gatekeeper/charts/gatekeeper
```

通过上述命令将创建出扩展组件的主 Chart，ksbuilder 会初始化一个基础的扩展组件包的目录结构，我们需要在此基础之上进行调整。

```bash
├── CHANGELOG.md
├── CHANGELOG_zh.md
├── README.md
├── README_zh.md
├── applicationclass.yaml
├── charts
│   ├── backend
│   │   ├── Chart.yaml
│   │   ├── templates
│   │   └── values.yaml
│   └── frontend
│       ├── Chart.yaml
│       ├── templates
│       └── values.yaml
├── extension.yaml
├── permissions.yaml
├── static
│   ├── favicon.svg
│   └── screenshots
│       └── screenshot.png
└── values.yaml
```

#### 编排 KubeSphere 扩展组件包

紧接着我们简单整理一下这个初始的目录结构，扩展组件中不包含前后端的扩展，我们需要将 Gatekeeper 的 Chart 作为[子 Chart](https://helm.sh/docs/chart_template_guide/subcharts_and_globals/) 在 KubeSphere 纳管的集群中安装部署。由于 GitHub 的联通性无法保证，我们需要将 Gatekeeper 的 Chart 包直接下载下来。

```bash
cd gatekeeper
# 移除用不到的 subchart、静态资源目录、模板文件等等
rm -rf charts/* static applicationclass.yaml
# 将 gatekeeper chart 保存到 charts 目录中
curl -o charts/gatekeeper-3.14.0.tgz https://open-policy-agent.github.io/gatekeeper/charts/gatekeeper-3.14.0.tgz
```

现在 KubeSphere 扩展组件包已经包含了一个主 Chart 和一个子 Chart，我们需要在 `extension.yaml` 中配置扩展组件的元数据信息，请参考票扩展组件 [extension.yaml 的定义](../../packaging-and-release/packaging/#extensionyaml-的定义) 。

与 Helm 不同的地方是 KubeSphere 扩展组件包需要在 `extension.yaml` 文件中定义元数据信息，相比于 Helm Chart 中的 `Chart.yaml`，可以定义更多的配置信息。

```yaml
apiVersion: kubesphere.io/v1alpha1
name: gatekeeper
version: 0.1.0
displayName:
  en: Gatekeeper
description:
  zh: Gatekeeper 是一个基于 OPA 的安全策略管理工具
  en: Gatekeeper is a security policy management tool based on OPA
category: security
keywords:
  - security
  - gatekeeper
  - opa
  - admission webhook
home: https://kubesphere.io
sources:
  - https://github.com/kubesphere-extensions/gatekeeper
kubeVersion: ">=1.19.0-0"
ksVersion: ">=4.0.0-0"
maintainers:
  - name: "hongming"
    email: hongming@kubesphere.io
provider:
  en:
    name: "hongming"
    email: kubesphere@yunify.com
  zh:
    name: 北京青云科技股份有限公司
    email: kubesphere@yunify.com
icon: https://open-policy-agent.github.io/gatekeeper/website/img/logo.svg
dependencies:
  - name: gatekeeper
    tags:
    - agent
# installationMode describes how to install subcharts, it can be HostOnly or Multicluster.
# In Multicluster mode, the subchart with tag `extension` will only be deployed to the host cluster,
# and the subchart with tag `agent` will be deployed to all selected clusters.
installationMode: Multicluster
```

参考 [permissions.yaml 的定义](../../packaging-and-release/packaging/#permissionsyaml-的定义) 根据 Gatekeeper Helm Chart 中的模板文件整理出安装部署时所需的权限列表，在 `permissions.yaml` 中进行配置：

{{%expand "展开 permissions.yaml" %}}

```yaml
kind: ClusterRole
rules:
  - apiGroups:
    - ""
    resources:
    - events
    verbs:
    - create
    - patch
  - apiGroups:
    - '*'
    resources:
    - '*'
    verbs:
    - get
    - list
    - watch
  - apiGroups:
      - 'apiextensions.k8s.io'
    resources:
      - 'customresourcedefinitions'
    verbs:
      - '*'
  - apiGroups:
      - 'config.gatekeeper.sh'
      - 'constraints.gatekeeper.sh'
      - 'expansion.gatekeeper.sh'
      - 'externaldata.gatekeeper.sh'
      - 'mutations.gatekeeper.sh'
      - 'status.gatekeeper.sh'
      - 'templates.gatekeeper.sh'
    resources:
      - '*'
    verbs:
      - '*'
  - apiGroups:
      - 'rbac.authorization.k8s.io'
    resources:
      - 'clusterroles'
      - 'clusterrolebindings'
    verbs:
      - 'create'
      - 'delete'
  - apiGroups:
      - ''
    resources:
      - 'namespaces'
    verbs:
      - 'patch'
      - 'update'
  - apiGroups:
      - 'rbac.authorization.k8s.io'
    resources:
      - 'clusterroles'
    verbs:
      - '*'
    resourceNames:
      - gatekeeper-manager-role
      - gatekeeper-admin-upgrade-crds   
  - apiGroups:
      - 'rbac.authorization.k8s.io'
    resources:
      - 'clusterrolebindings'
    verbs:
      - '*'
    resourceNames:
      - gatekeeper-manager-rolebinding
      - gatekeeper-admin-upgrade-crds
  - apiGroups:
      - 'policy'
    resources:
      - 'podsecuritypolicies'
    verbs:
      - '*'
    resourceNames:
      - gatekeeper-admin
  - apiGroups:
      - 'policy'
    resources:
      - 'podsecuritypolicies'
    verbs:
      - 'create'
  - apiGroups:
      - 'admissionregistration.k8s.io'
    resources:
      - 'mutatingwebhookconfigurations'
    verbs:
      - '*'
  - apiGroups:
      - 'admissionregistration.k8s.io'
    resources:
      - 'validatingwebhookconfigurations'
    verbs:
      - '*'



---
kind: Role
rules:
  - verbs:
      - '*'
    apiGroups:
      - '*'
    resources:
      - '*'
```

{{% /expand%}}

Gatekeeper 是一个子 Chart，我们需要将 Gatekeeper 中 `values.yaml` 中的配置合并到主 Chart 的 `values.yaml` 之中，直接向终端用户[暴露子 Chart 的参数](https://helm.sh/docs/chart_template_guide/subcharts_and_globals/)：

{{%expand "展开 values.yaml" %}}

```yaml
gatekeeper:
  replicas: 3
  revisionHistoryLimit: 10
  auditInterval: 60
  metricsBackends: ["prometheus"]
  auditMatchKindOnly: false
  constraintViolationsLimit: 20
  auditFromCache: false
  disableMutation: false
  disableValidatingWebhook: false
  validatingWebhookName: gatekeeper-validating-webhook-configuration
  validatingWebhookTimeoutSeconds: 3
  validatingWebhookFailurePolicy: Ignore
  validatingWebhookAnnotations: {}
  validatingWebhookExemptNamespacesLabels: {}
  validatingWebhookObjectSelector: {}
  validatingWebhookCheckIgnoreFailurePolicy: Fail
  validatingWebhookCustomRules: {}
  validatingWebhookURL: null
  enableDeleteOperations: false
  enableExternalData: true
  enableGeneratorResourceExpansion: true
  enableTLSHealthcheck: false
  maxServingThreads: -1
  mutatingWebhookName: gatekeeper-mutating-webhook-configuration
  mutatingWebhookFailurePolicy: Ignore
  mutatingWebhookReinvocationPolicy: Never
  mutatingWebhookAnnotations: {}
  mutatingWebhookExemptNamespacesLabels: {}
  mutatingWebhookObjectSelector: {}
  mutatingWebhookTimeoutSeconds: 1
  mutatingWebhookCustomRules: {}
  mutatingWebhookURL: null
  mutationAnnotations: false
  auditChunkSize: 500
  logLevel: INFO
  logDenies: false
  logMutations: false
  emitAdmissionEvents: false
  emitAuditEvents: false
  admissionEventsInvolvedNamespace: false
  auditEventsInvolvedNamespace: false
  resourceQuota: true
  externaldataProviderResponseCacheTTL: 3m
  image:
    repository: openpolicyagent/gatekeeper
    crdRepository: openpolicyagent/gatekeeper-crds
    release: v3.14.0
    pullPolicy: IfNotPresent
    pullSecrets: []
  preInstall:
    crdRepository:
      image:
        repository: null
        tag: v3.14.0
  postUpgrade:
    labelNamespace:
      enabled: false
      image:
        repository: openpolicyagent/gatekeeper-crds
        tag: v3.14.0
        pullPolicy: IfNotPresent
        pullSecrets: []
      extraNamespaces: []
      podSecurity: ["pod-security.kubernetes.io/audit=restricted",
        "pod-security.kubernetes.io/audit-version=latest",
        "pod-security.kubernetes.io/warn=restricted",
        "pod-security.kubernetes.io/warn-version=latest",
        "pod-security.kubernetes.io/enforce=restricted",
        "pod-security.kubernetes.io/enforce-version=v1.24"]
      extraAnnotations: {}
      priorityClassName: ""
    affinity: {}
    tolerations: []
    nodeSelector: {kubernetes.io/os: linux}
    resources: {}
    securityContext:
      allowPrivilegeEscalation: false
      capabilities:
        drop:
        - ALL
      readOnlyRootFilesystem: true
      runAsGroup: 999
      runAsNonRoot: true
      runAsUser: 1000
  postInstall:
    labelNamespace:
      enabled: true
      extraRules: []
      image:
        repository: openpolicyagent/gatekeeper-crds
        tag: v3.14.0
        pullPolicy: IfNotPresent
        pullSecrets: []
      extraNamespaces: []
      podSecurity: ["pod-security.kubernetes.io/audit=restricted",
        "pod-security.kubernetes.io/audit-version=latest",
        "pod-security.kubernetes.io/warn=restricted",
        "pod-security.kubernetes.io/warn-version=latest",
        "pod-security.kubernetes.io/enforce=restricted",
        "pod-security.kubernetes.io/enforce-version=v1.24"]
      extraAnnotations: {}
      priorityClassName: ""
    probeWebhook:
      enabled: true
      image:
        repository: curlimages/curl
        tag: 7.83.1
        pullPolicy: IfNotPresent
        pullSecrets: []
      waitTimeout: 60
      httpTimeout: 2
      insecureHTTPS: false
      priorityClassName: ""
    affinity: {}
    tolerations: []
    nodeSelector: {kubernetes.io/os: linux}
    securityContext:
      allowPrivilegeEscalation: false
      capabilities:
        drop:
        - ALL
      readOnlyRootFilesystem: true
      runAsGroup: 999
      runAsNonRoot: true
      runAsUser: 1000
  preUninstall:
    deleteWebhookConfigurations:
      extraRules: []
      enabled: false
      image:
        repository: openpolicyagent/gatekeeper-crds
        tag: v3.14.0
        pullPolicy: IfNotPresent
        pullSecrets: []
      priorityClassName: ""
    affinity: {}
    tolerations: []
    nodeSelector: {kubernetes.io/os: linux}
    resources: {}
    securityContext:
      allowPrivilegeEscalation: false
      capabilities:
        drop:
        - ALL
      readOnlyRootFilesystem: true
      runAsGroup: 999
      runAsNonRoot: true
      runAsUser: 1000
  podAnnotations: {}
  auditPodAnnotations: {}
  podLabels: {}
  podCountLimit: "100"
  secretAnnotations: {}
  enableRuntimeDefaultSeccompProfile: true
  controllerManager:
    exemptNamespaces: []
    exemptNamespacePrefixes: []
    hostNetwork: false
    dnsPolicy: ClusterFirst
    port: 8443
    metricsPort: 8888
    healthPort: 9090
    readinessTimeout: 1
    livenessTimeout: 1
    priorityClassName: system-cluster-critical
    disableCertRotation: false
    tlsMinVersion: 1.3
    clientCertName: ""
    strategyType: RollingUpdate
    affinity:
      podAntiAffinity:
        preferredDuringSchedulingIgnoredDuringExecution:
          - podAffinityTerm:
              labelSelector:
                matchExpressions:
                  - key: gatekeeper.sh/operation
                    operator: In
                    values:
                      - webhook
              topologyKey: kubernetes.io/hostname
            weight: 100
    topologySpreadConstraints: []
    tolerations: []
    nodeSelector: {kubernetes.io/os: linux}
    resources:
      limits:
        memory: 512Mi
      requests:
        cpu: 100m
        memory: 512Mi
    securityContext:
      allowPrivilegeEscalation: false
      capabilities:
        drop:
        - ALL
      readOnlyRootFilesystem: true
      runAsGroup: 999
      runAsNonRoot: true
      runAsUser: 1000
    podSecurityContext:
      fsGroup: 999
      supplementalGroups:
        - 999
    extraRules: []
    networkPolicy:
      enabled: false
      ingress: { }
        # - from:
        #   - ipBlock:
        #       cidr: 0.0.0.0/0
  audit:
    enablePubsub: false
    hostNetwork: false
    dnsPolicy: ClusterFirst
    metricsPort: 8888
    healthPort: 9090
    readinessTimeout: 1
    livenessTimeout: 1
    priorityClassName: system-cluster-critical
    disableCertRotation: false
    affinity: {}
    tolerations: []
    nodeSelector: {kubernetes.io/os: linux}
    resources:
      limits:
        memory: 512Mi
      requests:
        cpu: 100m
        memory: 512Mi
    securityContext:
      allowPrivilegeEscalation: false
      capabilities:
        drop:
        - ALL
      readOnlyRootFilesystem: true
      runAsGroup: 999
      runAsNonRoot: true
      runAsUser: 1000
    podSecurityContext:
      fsGroup: 999
      supplementalGroups:
        - 999
    writeToRAMDisk: false
    extraRules: []
  crds:
    affinity: {}
    tolerations: []
    nodeSelector: {kubernetes.io/os: linux}
    resources: {}
    securityContext:
      allowPrivilegeEscalation: false
      capabilities:
        drop:
        - ALL
      readOnlyRootFilesystem: true
      runAsGroup: 65532
      runAsNonRoot: true
      runAsUser: 65532
  pdb:
    controllerManager:
      minAvailable: 1
  service: {}
  disabledBuiltins: ["{http.send}"]
  psp:
    enabled: true
  upgradeCRDs:
    enabled: true
    extraRules: []
    priorityClassName: ""
  rbac:
    create: true
  externalCertInjection:
    enabled: false
    secretName: gatekeeper-webhook-server-cert
```

{{% /expand%}}

#### 将扩展组件提交到远程环境中

借助 ksbuilder 将扩展组件提交到 KubeSphere 远端环境的扩展商店。

```yaml
➜  gatekeeper git:(master) ✗ ksbuilder publish .
publish extension .
creating Extension gatekeeper.kubesphere.io
creating ExtensionVersion gatekeeper.kubesphere.io-0.1.0
creating ConfigMap extension-gatekeeper.kubesphere.io-0.1.0-chart
```

#### 部署测试

通过 `yarn start` 以 production 模式运行 KubeSphere Console 或访问远端的 KubeSphere Console，紧接着我们可以在扩展组件商店中看到我们通过 ksbuilder 提交上来的扩展组件。

![Gatekeeper Extension](gatekeeper-extension.png?width=1200px)

点击安装

![install-gatekeeper-extension](install-gatekeeper-extension.png?width=1200px)

扩展组件安装完成后，选择要部署 Gatekeeper 的集群

![install-gatekeeper-agent](install-gatekeeper-agent.png?width=1200px)

Gatekeeper 在指定集群中成功部署

![installed](installed.png?width=1200px)

创建 Gatekeeper Constraints 并测试

Gatekeeper 测试例子：<https://open-policy-agent.github.io/gatekeeper-library/website/validation/allowedrepos>

![gatekeeper-constraint-test](gatekeeper-constraint-test.png?width=1200px)
