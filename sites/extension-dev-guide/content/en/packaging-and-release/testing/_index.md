---
title: Test extensions
weight: 2
description: "Describe how to publish an extension to the Extension Marketplace and test the extension."
---

Previously, we have learnt how to develop and package extensions. In this section, we will learn how to test published extensions.

## Publish extensions

In the root directory `~/workspace/kubesphere-extensions/` of the extension, run the following command to publish the extension.

```shell
ksbuilder publish employee
```

Then you can log in to the ks-console via port 30880 and install and test the published extension.

![](./kubesphere-extensions.png)

安装完成后可以在 ks-console 页面查看扩展组件安装状态，安装失败可以在默认的 namespace extension-employee 查看日志。

By default, the extension will be published on the cluster specified in the system's default kubeconfig file (`~/.kube/config`). If you want to publish the extension to a specified cluster, you can use `--kubeconfig` parameter to specify the path of the kubeconfig file.

```shell
ksbuilder publish employee --kubeconfig=/path/to/config
```
