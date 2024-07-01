---
title: 发布扩展组件
weight: 03
description: "将扩展组件发布到 KubeSphere Marketplace"
---

完成扩展组件的打包、测试之后，您可以使用 ksbuilder 将扩展组件提交到 [KubeSphere Marketplace](https://kubesphere.com.cn/marketplace/)。

## 创建 API key

1. 在 [KubeSphere Cloud](https://kubesphere.cloud/) 注册一个账号。

2. 访问 [KubeSphere Marketplace](https://kubesphere.com.cn/marketplace/)，点击**入驻扩展市场**，签署协议，成为扩展组件服务商（即开发者）。

3. 打开 [KubeSphere Cloud 账号设置](https://kubesphere.cloud/user/setting/)，点击**安全** > **创建令牌**，勾选**扩展组件**，点击**创建**。
生成的令牌即为 Cloud API key, 格式如 `kck-1e63267b-cb3c-4757-b739-3d94a06781aa`. 请妥善保存。

![token](cloud-token.png?width=600px)


## 下载 ksbuilder 

访问 [ksbuilder 仓库](https://github.com/kubesphere/ksbuilder/releases)，下载最新的 ksbuilder。


## 使用 ksbuilder 提交扩展组件

1. 绑定 Cloud API key。

    ```bash
    ➜  ksbuilder login

    Enter API token: ****************************************
    Login Succeeded
    ```

2. 提交扩展组件，示例如下。

    ```bash
    ➜  ksbuilder push /Users/stone/Downloads/alc-1.1.0.tgz

    push extension /Users/stone/Downloads/alc-1.1.0.tgz
    Extension pushed and submitted to KubeSphere Cloud, waiting for review
    ```

3. 查看扩展组件的状态，提交后，状态应为 `submitted`。

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

4. 提交扩展组件后，即可在名为 kscloud-beta 的 Helm 仓库中搜索到扩展组件的安装包。方法如下：

    4.1. 将名为 kscloud-beta 的 Helm 仓库添加到 Helm 配置中。

    ```bash
    ➜  helm repo add kscloud-beta https://beta.app.kubesphere.cloud && helm repo update kscloud-beta

    "kscloud-beta" already exists with the same configuration, skipping
    Hang tight while we grab the latest from your chart repositories...
    ...Successfully got an update from the "kscloud-beta" chart repository
    Update Complete. ⎈Happy Helming!⎈
    ```

    4.2. 在 Helm 仓库中搜索扩展组件的 Helm Chart 包。

    ```bash
    ➜  helm search repo alc

    NAME            	CHART VERSION	APP VERSION	DESCRIPTION
    kscloud-beta/alc	1.1.0        	           	alc is an example extension
    ```

5. 等待扩展组件审批通过，即状态从 `submitted` 变为 `active`。

    ```bash
    ➜  ksbuilder get alc

    Name:     alc
    ID:       516955082294618939
    Status:   draft

    SNAPSHOT ID          VERSION   STATUS      UPDATE TIME
    516955082311396155   1.1.0     submitted   2024-06-06 07:27:20
    ```
   
6. 扩展组件审批通过后，即可在[扩展市场](https://kubesphere.com.cn/marketplace/)，以及 KubeSphere 控制台的扩展市场，订阅并安装该扩展组件。


## 重要说明

- 使用 ksbuilder push 命令提交扩展组件时，若扩展组件 extension.yaml 的 icon 或 screenshots 引用了安装包中的文件，这些文件将会被上传到 Kubesphere Cloud 的对象仓库中，icon 或 screenshots 将会被替换为文件在对象仓库中的 HTTP URL。ksbuilder 将会重新打包之后提交。整个过程是自动的。

- 替换后，扩展组件安装包大小不能超过 1 MB, 否则会提交失败。
