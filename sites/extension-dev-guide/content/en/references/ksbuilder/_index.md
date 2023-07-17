---
title: ksbuilder CLI Reference
weight: 1
description: ksbuilder is an extension packaging and release tool
---

{{< table_of_contents >}}

------

## ksbuilder

ksbuilder is the command line interface for the KubeSphere extension.

```
ksbuilder [flags]
```

### Options

```
  -h, --help   help for ksbuilder
```

------

## ksbuilder create

Run the following command to create a new KubeSphere extension.

```
ksbuilder create [flags]
```

### Options

```
  -h, --help   help for create
```

------

## ksbuilder package

Run the following command to pack the extension.

```
ksbuilder package [flags]
```

### Options

```
  -h, --help   help for package
```

------

## ksbuilder publish

执行以下命令将组件发布到扩展市场。

```
ksbuilder publish [flags]
```

### Options

```
  -h, --help                help for publish
      --kubeconfig string   kubeconfig file path of the target cluster
```

------

## ksbuilder version

执行以下命令查看组件版本。

```
ksbuilder version [flags]
```

### Options

```
  -h, --help   help for version
```

