---
title: UI 扩展
weight: 01
description: 介绍如何扩展 UI
---

与 dev 模式从本地加载扩展组件的方式不同，以 production 模式运行的 ks-console 只会从 JSBundle API 发现扩展组件并加载。在完成前端功能开发后，需要将代码打包生成 JS Bundle 文件，并通过 JSBundle 资源声明将扩展组件注入到 ks-console。

### 前端扩展组件打包

在前端工程目录下，使用 `yarn build:ext <extensionName>` 打包前端扩展，扩展组件源代码目录 `extensions/<extensionName>/dist` 下会生成 `index.js` 文件。

以 [extension-samples](https://github.com/kubesphere/extension-samples/tree/master/extensions-frontend) 项目中 hello-world 扩展组件为例，通过一下方式构建好扩展组件 JS Bundle 文件：

```bash
➜  extension-samples git:(master) ✗ cd extensions-frontend 
➜  extensions-frontend git:(master) ✗ yarn build:ext hello-world
yarn run v1.22.17
$ ksc build:ext hello-world
Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme
asset index.js 4.63 KiB [compared for emit] [minimized] (name: index)
webpack 5.74.0 compiled successfully in 525 ms

  Webpack Finished

✨  Done in 2.88s.
```

{{%expand "展开 extensions/hello-world/dist/index.js" %}}

```js
System.register(["react","styled-components"],(function(e,t){var r={},n={};return{setters:[function(e){r.default=e.default},function(e){n.default=e.default}],execute:function(){e(function(){var e={354:function(e,t,r){var n={"./base.json":197};function o(e){var t=i(e);return r(t)}function i(e){if(!r.o(n,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return n[e]}o.keys=function(){return Object.keys(n)},o.resolve=i,e.exports=o,o.id=354},882:function(e,t,r){var n={"./base.json":881};function o(e){var t=i(e);return r(t)}function i(e){if(!r.o(n,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return n[e]}o.keys=function(){return Object.keys(n)},o.resolve=i,e.exports=o,o.id=882},386:function(e,t,r){var n=r(149).R;t.s=function(e){if(e||(e=1),!r.y.meta||!r.y.meta.url)throw console.error("__system_context__",r.y),Error("systemjs-webpack-interop was provided an unknown SystemJS context. Expected context.meta.url, but none was provided");r.p=n(r.y.meta.url,e)}},149:function(e,t,r){function n(e,t){var r=document.createElement("a");r.href=e;for(var n="/"===r.pathname[0]?r.pathname:"/"+r.pathname,o=0,i=n.length;o!==t&&i>=0;){"/"===n[--i]&&o++}if(o!==t)throw Error("systemjs-webpack-interop: rootDirectoryLevel ("+t+") is greater than the number of directories ("+o+") in the URL path "+e);var c=n.slice(0,i+1);return r.protocol+"//"+r.host+c}t.R=n;var o=Number.isInteger||function(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e}},954:function(e){"use strict";e.exports=r},205:function(e){"use strict";e.exports=n},197:function(e){"use strict";e.exports={name:"Name"}},881:function(e){"use strict";e.exports={name:"名称"}}},o={};function i(t){var r=o[t];if(void 0!==r)return r.exports;var n=o[t]={exports:{}};return e[t](n,n.exports,i),n.exports}i.y=t,i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},function(){var e;i.g.importScripts&&(e=i.g.location+"");var t=i.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");r.length&&(e=r[r.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),i.p=e}();var c={};return(0,i(386).s)(1),function(){"use strict";i.r(c);var e=i(954),t=i(205).default.h3.withConfig({displayName:"App__Wrapper",componentId:"sc-1bs6lxk-0"})(["margin:8rem auto;text-align:center;"]);function r(){return e.default.createElement(t,null,"Say hi to the world!")}var n=[{path:"/hello-world",element:e.default.createElement(r,null)}];function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function u(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?u(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):u(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}for(var s=i(882),f=s.keys().filter((function(e){return"./index.ts"!==e})),l={},p=0;p<f.length;p+=1)f[p].startsWith(".")&&(l=a(a({},l),s(f[p])));var b=l;function y(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function d(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?y(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):y(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}for(var h=i(354),O=h.keys().filter((function(e){return"./index.ts"!==e})),m={},v=0;v<O.length;v+=1)O[v].startsWith(".")&&(m=d(d({},m),h(O[v])));var g={routes:n,menus:[{parent:"topbar",name:"hello-world",title:"HELLO_WORLD",icon:"cluster",order:0,desc:"Say hi to the world!",skipAuth:!0}],locales:{zh:b,en:m}};globals.context.registerExtension(g)}(),c}())}}}));
```

{{% /expand%}}

![yarn-build-ext](yarn-build-ext.png?width=1200px)

### 通过 ConfigMap 保存 JS Bundle 文件

在 default namespace 下创建 ConfigMap 保存 JS Bundle 文件

```bash
➜  extension-samples git:(master) cd extensions-frontend 
➜  extensions-frontend git:(master) kubectl create configmap hello-world --from-file=extensions/hello-world/dist/index.js
configmap/hello-world created
```

### 创建 JSBundle

**JSBundle：**

```bash
cat << EOF | kubectl apply -f -
apiVersion: extensions.kubesphere.io/v1alpha1
kind: JSBundle
metadata:
  name: hello-world
spec:
  rawFrom:
    configMapKeyRef:
      key: index.js
      name: hello-world
      namespace: default
status:
  link: /dist/hello-world/index.js
  state: Available
EOF
```

### production 模式下加载扩展组件

本地通过 `yarn start` 以 production 模式启动 KubeSphere Console 加载 JSBundle 声明的扩展组件

![ks-console](ks-console.png?width=1200px)

### JSBundle 字段说明

```yaml
apiVersion: extensions.kubesphere.io/v1alpha1
kind: JSBundle
metadata:
  name: hello-world
spec:
  rawFrom:
  # url: http://frontend.extension-hello-world.svc/dist/hello-world-ui/index.js
    configMapKeyRef:
      name: jsbundle
      key: index.js
      namespace: extension-hello-world
  # secretKeyRef:
  #   name: jsbundle
  #   key: index.js
  #   namespace: extension-hello-world
status:
  # 默认生成的静态文件地址格式为 /dist/{extensionName}/index.js
  # 静态文件的访问地址可以被手动指定为 /dist/{extensionName}/{subPath}/{fileName}
  link: /dist/hello-world/index.js 
  state: Available
```

| 字段 | 描述 |
| --- | ---|
| `spec.raw`</br>`spec.rawFrom.configMapKeyRef`</br>`spec.rawFrom.secretKeyRef` | 体积较小的 JS Bundle 文件可以直接在 JSBundle 声明中定义或者通过 ConfigMap、Secret 保存|
| `spec.rawFrom.url` | 体积较大的 JS Bundle 文件需要通过额外的文件服务来提供|
