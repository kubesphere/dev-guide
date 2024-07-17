---
title: UI 扩展
weight: 01
description: 介绍如何扩展 UI
---

与 dev 模式从本地加载扩展组件的方式不同，以 production 模式运行的 ks-console 只会从 JSBundle API 发现扩展组件并加载。在完成前端功能开发后，需要将代码打包生成 JS Bundle 文件，并通过 JSBundle 资源声明将扩展组件注入到 ks-console。

### 前端扩展组件打包

在前端工程目录下，使用 `yarn build:ext <extensionName>` 打包前端扩展，扩展组件源代码目录 `extensions/<extensionName>/dist` 下会生成 `index.js` 文件。

以 [extension-samples](https://github.com/kubesphere/extension-samples/tree/master/extensions-frontend) 项目中 hello-world 扩展组件为例，通过以下方式构建扩展组件 JS Bundle 文件：

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
System.register(["react","styled-components"],(function(t,e){var r={},n={};return{setters:[function(t){r.default=t.default},function(t){n.default=t.default}],execute:function(){t(function(){var t={477:function(t,e,r){var n={"./base.json":77};function o(t){var e=i(t);return r(e)}function i(t){if(!r.o(n,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return n[t]}o.keys=function(){return Object.keys(n)},o.resolve=i,t.exports=o,o.id=477},422:function(t,e,r){var n={"./base.json":214};function o(t){var e=i(t);return r(e)}function i(t){if(!r.o(n,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return n[t]}o.keys=function(){return Object.keys(n)},o.resolve=i,t.exports=o,o.id=422},725:function(t,e,r){var n=r(825).y;e.w=function(t){if(t||(t=1),!r.y.meta||!r.y.meta.url)throw console.error("__system_context__",r.y),Error("systemjs-webpack-interop was provided an unknown SystemJS context. Expected context.meta.url, but none was provided");r.p=n(r.y.meta.url,t)}},825:function(t,e,r){function n(t,e){var r=document.createElement("a");r.href=t;for(var n="/"===r.pathname[0]?r.pathname:"/"+r.pathname,o=0,i=n.length;o!==e&&i>=0;){"/"===n[--i]&&o++}if(o!==e)throw Error("systemjs-webpack-interop: rootDirectoryLevel ("+e+") is greater than the number of directories ("+o+") in the URL path "+t);var c=n.slice(0,i+1);return r.protocol+"//"+r.host+c}e.y=n;var o=Number.isInteger||function(t){return"number"==typeof t&&isFinite(t)&&Math.floor(t)===t}},726:function(t){"use strict";t.exports=r},815:function(t){"use strict";t.exports=n},77:function(t){"use strict";t.exports={name:"Name"}},214:function(t){"use strict";t.exports={name:"名称"}}},o={};function i(e){var r=o[e];if(void 0!==r)return r.exports;var n=o[e]={exports:{}};return t[e](n,n.exports,i),n.exports}i.y=e,i.d=function(t,e){for(var r in e)i.o(e,r)&&!i.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},function(){var t;i.g.importScripts&&(t=i.g.location+"");var e=i.g.document;if(!t&&e&&(e.currentScript&&(t=e.currentScript.src),!t)){var r=e.getElementsByTagName("script");if(r.length)for(var n=r.length-1;n>-1&&(!t||!/^http(s?):/.test(t));)t=r[n--].src}if(!t)throw new Error("Automatic publicPath is not supported in this browser");t=t.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),i.p=t}();var c={};return(0,i(725).w)(1),function(){"use strict";i.r(c),i.d(c,{default:function(){return j}});var t=i(726),e=i(815).default.h3.withConfig({displayName:"App__Wrapper",componentId:"sc-1bs6lxk-0"})(["margin:8rem auto;text-align:center;"]);function r(){return t.default.createElement(e,null,"Say hi to the world!")}var n=[{path:"/hello-world",element:t.default.createElement(r,null)}];function o(t){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o(t)}function u(t){var e=function(t,e){if("object"!=o(t)||!t)return t;var r=t[Symbol.toPrimitive];if(void 0!==r){var n=r.call(t,e||"default");if("object"!=o(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(t,"string");return"symbol"==o(e)?e:e+""}function a(t,e,r){return(e=u(e))in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function s(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function f(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?s(Object(r),!0).forEach((function(e){a(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}for(var l=i(422),p=l.keys().filter((function(t){return"./index.ts"!==t})),y={},b=0;b<p.length;b+=1)p[b].startsWith(".")&&(y=f(f({},y),l(p[b])));var m=y;function d(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function v(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?d(Object(r),!0).forEach((function(e){a(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):d(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}for(var h=i(477),O=h.keys().filter((function(t){return"./index.ts"!==t})),g={},w=0;w<O.length;w+=1)O[w].startsWith(".")&&(g=v(v({},g),h(O[w])));var j={routes:n,menus:[{parent:"topbar",name:"hello-world",title:"HELLO_WORLD",icon:"cluster",order:0,desc:"Say hi to the world!",skipAuth:!0}],locales:{zh:m,en:g}}}(),c}())}}}));
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

本地通过 `yarn start` 以 production 模式启动 KubeSphere Console 加载 JSBundle 声明的扩展组件。

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

### 创建 ExtensionEntry

除了在扩展组件前端 js/ts 文件中的 `menus` 可以配置[挂载位置](./feature-customization/menu/)以外，还可以通过 `ExtensionEntry` 配置。

`ExtensionEntry` 的优先级高于 `menus`。如果在 `ExtensionEntry` 和 `menus` 中同时配置了有效的挂载位置，只有 `ExtensionEntry` 会生效，`menus` 中的配置会被忽略。

**ExtensionEntry 示例：**

```bash
cat << EOF | kubectl apply -f -
apiVersion: extensions.kubesphere.io/v1alpha1
kind: ExtensionEntry
metadata:
  name: {{ include "frontend.fullname" . }}-extension-entries
spec:
  entries:
    - parent: "global"
      name: "hello-world"
      link: "/hello-world"
      title: "HELLO_WORLD"
      icon: "cluster"
      order: 0
      desc: "HELLO_WORLD_DESC"
      authKey: "hello"
      authAction: "hello-view"
      skipAuth: true
EOF
```

### ExtensionEntry 字段说明

`ExtensionEntry` 字段和 `menus` 一致，请参阅[设置挂载位置](./feature-customization/menu/#设置挂载位置)。
