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
System.register(["react","styled-components"],(function(e,t){var r={},n={};return{setters:[function(e){r.default=e.default},function(e){n.default=e.default}],execute:function(){e(function(){var e={354:function(e,t,r){var n={"./base.json":197};function o(e){var t=i(e);return r(t)}function i(e){if(!r.o(n,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return n[e]}o.keys=function(){return Object.keys(n)},o.resolve=i,e.exports=o,o.id=354},882:function(e,t,r){var n={"./base.json":881};function o(e){var t=i(e);return r(t)}function i(e){if(!r.o(n,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return n[e]}o.keys=function(){return Object.keys(n)},o.resolve=i,e.exports=o,o.id=882},386:function(e,t,r){var n=r(149).R;t.s=function(e){if(e||(e=1),!r.y.meta||!r.y.meta.url)throw console.error("__system_context__",r.y),Error("systemjs-webpack-interop was provided an unknown SystemJS context. Expected context.meta.url, but none was provided");r.p=n(r.y.meta.url,e)}},149:function(e,t,r){function n(e,t){var r=document.createElement("a");r.href=e;for(var n="/"===r.pathname[0]?r.pathname:"/"+r.pathname,o=0,i=n.length;o!==t&&i>=0;){"/"===n[--i]&&o++}if(o!==t)throw Error("systemjs-webpack-interop: rootDirectoryLevel ("+t+") is greater than the number of directories ("+o+") in the URL path "+e);var c=n.slice(0,i+1);return r.protocol+"//"+r.host+c}t.R=n;var o=Number.isInteger||function(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e}},954:function(e){"use strict";e.exports=r},205:function(e){"use strict";e.exports=n},197:function(e){"use strict";e.exports={name:"Name"}},881:function(e){"use strict";e.exports={name:"名称"}}},o={};function i(t){var r=o[t];if(void 0!==r)return r.exports;var n=o[t]={exports:{}};return e[t](n,n.exports,i),n.exports}i.y=t,i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},function(){var e;i.g.importScripts&&(e=i.g.location+"");var t=i.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");r.length&&(e=r[r.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),i.p=e}();var c={};return(0,i(386).s)(1),function(){"use strict";i.r(c);var e=i(954),t=i(205).default.h3.withConfig({displayName:"App__Wrapper",componentId:"sc-1bs6lxk-0"})(["margin:8rem auto;text-align:center;"]);function r(){return e.default.createElement(t,null,"Say hi to the world!")}var n=[{path:"/hello-world",element:e.default.createElement(r,null)}];function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function u(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?u(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):u(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}for(var s=i(882),f=s.keys().filter((function(e){return"./index.ts"!==e})),l={},p=0;p<f.length;p+=1)f[p].startsWith(".")&&(l=a(a({},l),s(f[p])));var b=l;function y(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function d(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?y(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):y(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}for(var h=i(354),O=h.keys().filter((function(e){return"./index.ts"!==e})),m={},v=0;v<O.length;v+=1)O[v].startsWith(".")&&(m=d(d({},m),h(O[v])));var g={routes:n,menus:[{parent:"topbar",name:"hello-world",title:"HELLO_WORLD",icon:"cluster",order:0,desc:"Say hi to the world!",skipAuth:!0}],locales:{zh:b,en:m}};globals.context.registerExtension(g)}(),c}())}}}));
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

### Load extensions in production mode

Locally start KubeSphere Console in production mode using `yarn start` to load the extension declared in JSBundle.

![ks-console](ks-console.png?width=1200px)

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