---
title: Test Extensions
weight: 2
description: "Describe how to publish an extension to the KubeSphere Marketplace and test the extension."
---


Once the extension is packaged, you can push it to the remote environment for deployment and testing in the KubeSphere Marketplace.

## Push the extension

Use the `ksbuilder publish <dir>/<extension package>` command to push the extension to the remote KubeSphere Marketplace.

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

Access the remote KubeSphere Console, and you will see the extension in the KubeSphere Marketplace.

![hello-world-extension](hello-world-extension.png?width=1200px)

## Install the extension

Install the extension.

![install-hello-world-extension](install-hello-world-extension.png?width=1200px)

The extension has been successfully enabled.

![enable-hello-world-extension](enable-hello-world-extension.png?width=1200px)