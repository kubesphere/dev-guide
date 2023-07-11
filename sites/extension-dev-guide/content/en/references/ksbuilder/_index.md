---
title: ksbuilder CLI 参考
weight: 1
description: ksbuilder is an extension packaging and release tool
---

{{< table_of_contents >}}

------

## ksbuilder

ksbuilder 是 KubeSphere 扩展组件的命令行接口。

```
ksbuilder [flags]
```

### Options

```
  -h, --help   help for ksbuilder
```

------

## ksbuilder create

执行以下命令创建新的 KubeSphere 组件。

```
ksbuilder create [flags]
```

### Options

```
  -h, --help   help for create
```

------

## ksbuilder package

执行以下命令打包组件。

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

