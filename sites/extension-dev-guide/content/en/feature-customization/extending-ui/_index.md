---
title: UI Extension
weight: 01
description: Describes how to extend the UI.
---

Unlike the way extensions are loaded locally in development mode, the ks-console running in production mode only discovers and loads extensions from the JSBundle API. After completing the frontend development, it's necessary to package the code to generate JS Bundle files and inject the extension into ks-console through JSBundle resource declarations.

### Package frontend extension

In the frontend project directory, use `yarn build:ext <extension>` to package the frontend extension, which will generate the `index.js` file in the extension source code directory `extensions/<extensionName>/dist`.

Using the hello-world extension in the [extension-samples](https://github.com/kubesphere/extension-samples/tree/master/extensions-frontend) project as an example, let's build the extension JS Bundle files in the following way:

```bash
➜  extension-samples git:(master) ✗ cd extensions-frontend 
➜  extensions-frontend git:(master) ✗ yarn build:ext hello-world
yarn run v1.22.17
ksc build:ext hello-world
Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme
asset index.js 4.63 KiB [compared for emit] [minimized] (name: index)
webpack 5.74.0 compiled successfully in 525 ms

  Webpack Finished

✨  Done in 2.88s.
```
{{%expand "Show extensions/hello-world/dist/index.js" %}}


```js
System.register(["react","styled-components"],(function(t,e){var r={},n={};return{setters:[function(t){r.default=t.default},function(t){n.default=t.default}],execute:function(){t(function(){var t={477:function(t,e,r){var n={"./base.json":77};function o(t){var e=i(t);return r(e)}function i(t){if(!r.o(n,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return n[t]}o.keys=function(){return Object.keys(n)},o.resolve=i,t.exports=o,o.id=477},422:function(t,e,r){var n={"./base.json":214};function o(t){var e=i(t);return r(e)}function i(t){if(!r.o(n,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return n[t]}o.keys=function(){return Object.keys(n)},o.resolve=i,t.exports=o,o.id=422},725:function(t,e,r){var n=r(825).y;e.w=function(t){if(t||(t=1),!r.y.meta||!r.y.meta.url)throw console.error("__system_context__",r.y),Error("systemjs-webpack-interop was provided an unknown SystemJS context. Expected context.meta.url, but none was provided");r.p=n(r.y.meta.url,t)}},825:function(t,e,r){function n(t,e){var r=document.createElement("a");r.href=t;for(var n="/"===r.pathname[0]?r.pathname:"/"+r.pathname,o=0,i=n.length;o!==e&&i>=0;){"/"===n[--i]&&o++}if(o!==e)throw Error("systemjs-webpack-interop: rootDirectoryLevel ("+e+") is greater than the number of directories ("+o+") in the URL path "+t);var c=n.slice(0,i+1);return r.protocol+"//"+r.host+c}e.y=n;var o=Number.isInteger||function(t){return"number"==typeof t&&isFinite(t)&&Math.floor(t)===t}},726:function(t){"use strict";t.exports=r},815:function(t){"use strict";t.exports=n},77:function(t){"use strict";t.exports={name:"Name"}},214:function(t){"use strict";t.exports={name:"名称"}}},o={};function i(e){var r=o[e];if(void 0!==r)return r.exports;var n=o[e]={exports:{}};return t[e](n,n.exports,i),n.exports}i.y=e,i.d=function(t,e){for(var r in e)i.o(e,r)&&!i.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},function(){var t;i.g.importScripts&&(t=i.g.location+"");var e=i.g.document;if(!t&&e&&(e.currentScript&&(t=e.currentScript.src),!t)){var r=e.getElementsByTagName("script");if(r.length)for(var n=r.length-1;n>-1&&(!t||!/^http(s?):/.test(t));)t=r[n--].src}if(!t)throw new Error("Automatic publicPath is not supported in this browser");t=t.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),i.p=t}();var c={};return(0,i(725).w)(1),function(){"use strict";i.r(c),i.d(c,{default:function(){return j}});var t=i(726),e=i(815).default.h3.withConfig({displayName:"App__Wrapper",componentId:"sc-1bs6lxk-0"})(["margin:8rem auto;text-align:center;"]);function r(){return t.default.createElement(e,null,"Say hi to the world!")}var n=[{path:"/hello-world",element:t.default.createElement(r,null)}];function o(t){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o(t)}function u(t){var e=function(t,e){if("object"!=o(t)||!t)return t;var r=t[Symbol.toPrimitive];if(void 0!==r){var n=r.call(t,e||"default");if("object"!=o(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(t,"string");return"symbol"==o(e)?e:e+""}function a(t,e,r){return(e=u(e))in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function s(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function f(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?s(Object(r),!0).forEach((function(e){a(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}for(var l=i(422),p=l.keys().filter((function(t){return"./index.ts"!==t})),y={},b=0;b<p.length;b+=1)p[b].startsWith(".")&&(y=f(f({},y),l(p[b])));var m=y;function d(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function v(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?d(Object(r),!0).forEach((function(e){a(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):d(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}for(var h=i(477),O=h.keys().filter((function(t){return"./index.ts"!==t})),g={},w=0;w<O.length;w+=1)O[w].startsWith(".")&&(g=v(v({},g),h(O[w])));var j={routes:n,menus:[{parent:"topbar",name:"hello-world",title:"HELLO_WORLD",icon:"cluster",order:0,desc:"Say hi to the world!",skipAuth:!0}],locales:{zh:m,en:g}}}(),c}())}}}));
```

{{% /expand%}}

![yarn-build-ext](yarn-build-ext.png?width=1200px)

### Save JS Bundle Files via ConfigMap

Create a ConfigMap to store JS Bundle files in the default namespace.

```bash
➜  extension-samples git:(master) cd extensions-frontend 
➜  extensions-frontend git:(master) kubectl create configmap hello-world --from-file=extensions/hello-world/dist/index.js
configmap/hello-world created
```

### Create JSBundle

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

### Explanation of JSBundle fields

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
  # The default generated static file address format is /dist/{extensionName}/index.js
  # The access address of static files can be manually specified as /dist/{extensionName}/{subPath}/{fileName}
  link: /dist/hello-world/index.js 
  state: Available
```

| Field | Description |
| --- | ---|
| `spec.raw`</br>`spec.rawFrom.configMapKeyRef`</br>`spec.rawFrom.secretKeyRef` | Small-sized JS Bundle files can be directly defined in the JSBundle declaration or saved by ConfigMap and Secret. |
| `spec.rawFrom.url` | Large-sized JS Bundle files should be provided through an additional file service. |

### Create ExtensionEntry

In addition to configuring the [mounting point](../menu/) in the `menus` section of the frontend JS/TS files of the extension, you can also configure it through `ExtensionEntry`.

The priority of `ExtensionEntry` is higher than `menus`. If valid mounting points are configured in both `ExtensionEntry` and `menus`, only the settings in `ExtensionEntry` will take effect, and the configurations in `menus` will be ignored.

**Example of ExtensionEntry:**

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

### Explanation of ExtensionEntry Fields

The fields in `ExtensionEntry` are similar to those in `menus`, please refer to [Configure a mount point](../menu/#configure-a-mount-point) for more information.