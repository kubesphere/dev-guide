---
title: 测试扩展组件
weight: 02
description: "将扩展组件上架到 KubeSphere 扩展组件商店中进行测试"
---

经过前面的章节，我们已经完成了扩展组件的开发，在发布之前我们需要针对扩展组件做集成测试。

## 扩展组件上架

在扩展组件管理工程根目录（`~/workspace/kubesphere/extension-repo/`）执行下述命令，将扩展组件上架到 KubeSphere 扩展组件商店中。

```shell
ksbuilder publish employee
```

命令执行成功后，我们可以直接访问 kubesphere 容器 30880 端口打开 ks-console 页面并登录，查看扩展组件商店中上架的组件，并进行安装测试。
