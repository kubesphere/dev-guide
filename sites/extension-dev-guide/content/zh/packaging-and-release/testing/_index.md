---
title: 测试扩展组件
weight: 02
description: "将扩展组件上架到 KubeSphere 扩展市场中进行测试"
---

扩展组件打包好之后，需要将扩展组件推送到远端环境，通过扩展组件商店进行部署测试。

## 推送扩展组件

通过 `ksbuilder publish <dir>/<extension package>` 命令，可以将将扩展组件推送到远端的扩展组件商店。

```bash
➜  extension-samples git:(master) ✗ cd extensions
➜  extensions git:(master) ✗ ksbuilder package hello-world    
package extension hello-world
package saved to /Users/hongming/GitHub/extension-samples/extensions/hello-world-0.1.0.tgz
➜  extensions git:(master) ✗ ksbuilder publish hello-world-0.1.0.tgz 
publish extension hello-world-0.1.0.tgz
creating Extension hello-world
creating ExtensionVersion hello-world-0.1.0
creating ConfigMap extension-hello-world-0.1.0-chart
```

访问远端的 KubeSphere Console，在扩展组件商店可以看到推送上来的扩展组件。

![hello-world-extension](hello-world-extension.png?width=1200px)

## 安装扩展组件

安装扩展组件

![install-hello-world-extension](install-hello-world-extension.png?width=1200px)

扩展组件成功启用

![enable-hello-world-extension](enable-hello-world-extension.png?width=1200px)