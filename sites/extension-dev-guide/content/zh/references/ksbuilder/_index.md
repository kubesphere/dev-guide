---
title: ksbuilder CLI reference
weight: 01
description:  ksbuilder 扩展组件打包、发布工具
---

{{< table_of_contents >}}

------

## ksbuilder

ksbuilder is a command line interface for KubeSphere extension system

```
ksbuilder [flags]
```

### 可选项

```
  -h, --help   help for ksbuilder
```

------

## ksbuilder create

Create a new KubeSphere extension

```
ksbuilder create [flags]
```

### 可选项

```
  -h, --help   help for create
```

------

## ksbuilder init

Init a new KubeSphere extension project

```
ksbuilder init [flags]
```

### 可选项

```
  -d, --directory string   directory
  -h, --help               help for init
```

------

## ksbuilder install

install an extension

```
ksbuilder install [flags]
```

### 可选项

```
  -h, --help               help for install
  -n, --namespace string   namespace (default "extension-default")
```

------

## ksbuilder uninstall

uninstall an extension

```
ksbuilder uninstall [flags]
```

### 可选项

```
  -h, --help               help for uninstall
  -n, --namespace string   namespace (default "extension-default")
```

------

## ksbuilder update

update a extension

```
ksbuilder update [flags]
```

### 可选项

```
  -h, --help               help for update
  -n, --namespace string   namespace (default "extension-default")
```

------

## ksbuilder version

Display version

```
ksbuilder version [flags]
```

### 可选项

```
  -h, --help   help for version
```

