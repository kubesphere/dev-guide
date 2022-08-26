---
title: 测试扩展组件
weight: 02
description: "将打包完成的扩展组件部署到 KubeSphere 进行测试"
---

经过前面的章节，我们已经完成了扩展组件的开发与打包，在发布之前我们需要针对扩展组件做最后的集成测试。

## 扩展组件部署

在扩展组件管理工程根目录（`~/workspace/kubesphere/extension-repo/`）执行下述命令，将扩展组件部署到 KubeSphere 环境中。

```shell
ksbuilder update employee
```

命令执行成功后，我们可以直接访问 kubesphere 容器 30880 端口打开 ks-console 页面并登陆，查看对应的扩展组件页面、导航栏按钮是否正常加载。
