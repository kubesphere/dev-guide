---
title: Publish Extensions
weight: 03
description: "Publish extensions to KubeSphere Marketplace."
---

After completing the packaging and testing of extensions, you can use ksbuilder to submit the extensions to the [KubeSphere Marketplace](https://kubesphere.com.cn/marketplace/).

## Create an API key

1. Register an account on [KubeSphere Cloud](https://kubesphere.cloud/).

2. Visit the [KubeSphere Marketplace](https://kubesphere.com.cn/marketplace/) and click on **Become a partner** to sign the agreement and become an extension provider (i.e., developer).

3. Open the KubeSphere Cloud account settings and click on **Security** > **Create Access Token**, check **Extension**, and click **Create**.
The generated token is the Cloud API key, in the format of `kck-1e63267b-cb3c-4757-b739-3d94a06781aa`. Please keep it secure.

## Download ksbuilder

Visit the [ksbuilder repository](https://github.com/kubesphere/ksbuilder/releases) and download the latest version of ksbuilder.

## Submit extensions using ksbuilder

1. Bind the Cloud API key.

```bash
➜  ksbuilder login

Enter API token: ****************************************
Login Succeeded
```

2. Submit the extension as shown below.

```bash
➜  ksbuilder push /Users/stone/Downloads/alc-1.1.0.tgz

push extension /Users/stone/Downloads/alc-1.1.0.tgz
Extension pushed and submitted to KubeSphere Cloud, waiting for review
```

3. Check the status of the extension. After submission, the status should be `submitted`.

```bash
➜  ksbuilder list

ID                   NAME   STATUS   LATEST VERSION
516955082294618939   alc    draft
```

```bash
➜  ksbuilder get alc

Name:     alc
ID:       516955082294618939
Status:   draft

SNAPSHOT ID          VERSION   STATUS      UPDATE TIME
516955082311396155   1.1.0     submitted   2024-06-06 07:27:20
```

4. After submitting the extension, you can search for the helm chart package of the extension in the Helm repository named `kscloud-beta`. Follow the steps below:

4.1. Add the Helm repository named `kscloud-beta` to the Helm configuration.

```bash
➜  helm repo add kscloud-beta https://beta.app.kubesphere.cloud && helm repo update kscloud-beta

"kscloud-beta" already exists with the same configuration, skipping
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "kscloud-beta" chart repository
Update Complete. ⎈Happy Helming!⎈
```

4.2. Search for the Helm Chart package of the extension in the Helm repository.

```bash
➜  helm search repo alc

NAME            	CHART VERSION	APP VERSION	DESCRIPTION
kscloud-beta/alc	1.1.0        	           	alc is an example extension
```

5. Wait for the approval of the extension. The status should change from `submitted` to `active`.

```bash
➜  ksbuilder get alc

Name:     alc
ID:       516955082294618939
Status:   draft

SNAPSHOT ID          VERSION   STATUS      UPDATE TIME
516955082311396155   1.1.0     submitted   2024-06-06 07:27:20
```

6. After the extension is approved, you can subscribe to and install the extension in the [KubeSphere Marketplace](https://kubesphere.com.cn/marketplace/) and in the KubeSphere web console.

## Important Notes

- When using the `ksbuilder push` command to submit the extension, if the icon or screenshots in the `extension.yaml` file of the extension reference files in the helm chart package, these files will be automatically uploaded to the QingStor repository of KubeSphere Cloud, and the icon or screenshots will be automatically replaced with the HTTP URL of the files in the repository. In addition, ksbuilder will repackage and submit them automatically.

- After replacement, the size of the extension package cannot exceed 1 MB, otherwise, the submission will fail.