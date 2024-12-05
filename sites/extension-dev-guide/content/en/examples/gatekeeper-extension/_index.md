---
title: Gatekeeper
weight: 01
description: Integrate Gatekeeper.
---

This section will use Gatekeeper as an example to show how to migrate a Helm Chart to the KubeSphere platform as an extension.

This example does not involve extending the KubeSphere UI. After converting the Helm Chart of Gatekeeper into a KubeSphere extension, you can install and deploy it to the clusters managed by KubeSphere through the KubeSphere Marketplace.

Source code for this example: [https://github.com/kubesphere-extensions/gatekeeper/tree/master/charts/gatekeeper](https://github.com/kubesphere-extensions/gatekeeper/tree/master/charts/gatekeeper)

#### What is Gatekeeper

[Open Policy Agent (OPA)](https://github.com/open-policy-agent/opa) is an open-source general-purpose policy engine that unifies policy enforcement across the entire stack. OPA provides a high-level declarative language that allows users to define policies through simple code.

Gatekeeper is a security policy management tool built on OPA and the [Kubernetes admission webhook](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/) mechanism. It ensures cluster security and compliance of clusters without sacrificing development agility and operational independence.

For example, the following policies can be enforced in a Kubernetes (K8s) cluster:

* All container images must originate from a trusted image repository.
* The host names of all Ingress objects must be globally unique.
* All pods must be configured with `limit` and `request`.
* Mounting host paths is not allowed.

The OPA community has provided the [Helm Chart](https://github.com/open-policy-agent/gatekeeper/tree/master/charts/gatekeeper) for Gatekeeper. Let's quickly integrate it into the KubeSphere Marketplace using the following steps.


#### Use ksbuilder to create an extension package:

```bash
➜  charts git:(master) ksbuilder create
Please input extension name: gatekeeper
✔ security
Please input extension author: hongming
Please input Email (optional): hongming@kubesphere.io
Please input author's URL (optional): 
Directory: /Users/hongming/GitHub/gatekeeper/charts/gatekeeper
```

The above command creates the main Chart for the extension. `ksbuilder` initializes a basic directory structure for the extension package, and you need to adjust it.

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

#### Orchestrate the KubeSphere Extension Package

Next, organize the initial directory structure. Since the extension doesn't include front-end and back-end extensions, you need to deploy the Gatekeeper Chart as a [subchart](https://helm.sh/docs/chart_template_guide/subcharts_and_globals/) in a KubeSphere-managed cluster. Due to potential connectivity issues with GitHub, please download the Gatekeeper Chart.

```bash
cd gatekeeper
# Remove unnecessary subcharts, static resource directories, template files, etc.
rm -rf charts/* static applicationclass.yaml
# Save the Gatekeeper chart to the charts directory
curl -o charts/gatekeeper-3.14.0.tgz https://open-policy-agent.github.io/gatekeeper/charts/gatekeeper-3.14.0.tgz
```

The extension package now includes a main Chart and a subchart. Next, you need to configure the metadata information of the extension in the `extension.yaml`. Please refer to [Definition of extension.yaml](../../packaging-and-release/packaging/#definition-of-extensionyaml) for more info.

Unlike Helm, the metadata information of KubeSphere extension packages should be defined in the `extension.yaml` file. In comparison to the `Chart.yaml` in Helm Chart, `extension.yaml` can define more configurations.


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

Refer to [Definition of permissions.yaml](../../packaging-and-release/packaging/#definition-of-permissionsyaml) and organize the permissions list required for installation and deployment based on the template files in the Gatekeeper Helm Chart to configure in the `permissions.yaml`.


{{%expand "Show permissions.yaml" %}}

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

Gatekeeper is a subchart, so you need to merge the configurations from the `values.yaml` in Gatekeeper into the `values.yaml` of the main Chart, and [expose the parameters of subcharts](https://helm.sh/docs/chart_template_guide/subcharts_and_globals/) directly to end-users.

{{%expand "Show values.yaml" %}}

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

#### Submit the extension to the remote environment

Use `ksbuilder` to submit the extension to the KubeSphere Marketplace in the remote KubeSphere environment.

```yaml
➜  gatekeeper git:(master) ✗ ksbuilder publish .
publish extension .
creating Extension gatekeeper.kubesphere.io
creating ExtensionVersion gatekeeper.kubesphere.io-0.1.0
creating ConfigMap extension-gatekeeper.kubesphere.io-0.1.0-chart
```

#### Deployment and testing

Access the KubeSphere Console, you will see the extension submitted by `ksbuilder` in the KubeSphere Marketplace.

![Gatekeeper Extension](gatekeeper-extension.png?width=1200px)

1. Install Gatekeeper.

![install-gatekeeper-extension](install-gatekeeper-extension.png?width=1200px)

2. After the installation is completed, choose the cluster where Gatekeeper will be deployed.

![install-gatekeeper-agent](install-gatekeeper-agent.png?width=1200px)

3. Gatekeeper has been successfully deployed in the specified cluster.

![installed](installed.png?width=1200px)

4. Create Gatekeeper Constraints and test.

    Gatekeeper testing examples：<https://open-policy-agent.github.io/gatekeeper-library/website/validation/allowedrepos>

![gatekeeper-constraint-test](gatekeeper-constraint-test.png?width=1200px)
