---
layout: default
title: RequireJS
---

使用AMD(asynchronous module definition)规范的意义：

* 传统意义上的JS同步加载中，对模块的调用必须等待模块的读取完成才能进行，会受到到网速和模块大小的制约
* 功能性的脚本标签必须置于其它脚本标签之前。大量脚本的加载会严重影响网页渲染的速度，其之间的依赖关系也会增加维护难度
* AMD中，
    - 无论是加载器还是自动化工具都可以很直接的获取到依赖，无需通过静态分析
    - `factory`中的准备语句在回调发生之前就已经执行完毕
* CMD中，
    - 模块真正使用前需要提取模块中所有的依赖，故需提前加载模块，此过程只能通过静态分析实现
    - `factory`中的准备语句在回调发生时才开始执行

```javascript
require.config(obj){}

// config对象
{
     BaseUrl: 'js',
     Paths: {
          'jquery': ['http://xxx/jquery', 'js/jquery'],
          'a':  'js/a'
     }
}
```

给requirejs标签添加`data-main=‘path/xxx’`属性：

* 使`xxx.js`在requirejs加载完成之后第一个加载
* 使所有脚本共享`xxx.js`中的`require.config`
* 使该标签中的脚本路径为跟路径，相当于配置`config`的`baseUrl`
    
    - 测试发现命名以`_`开头的脚本无法被识别

```javascript
/*
@param {=string} id 可为模块以id命名，但官方文档不建议这样做，可能破坏可移植性
@param {=array.<string>} deps 依赖的模块名数组，模块按相应顺序传入factory作为其参数
@param {object|function} factory 直接定义的键值对象或返回键值对象的函数
*/
define(id?, deps?, factory){}
```

```javascript
/*
@param {=array.<string>} deps 依赖的模块名数组
@param {function} callback 加载成功后的回调函数，每个模块按数组中的顺序以参数形式传入之
*/
require(deps?, callback){}
```

定义`data-main`可产生的一个小问题：此属性指向的脚本以异步方式加载。内容较少的页面很有可能在脚本之前加载完成，此时`window.onload()`不可能触发。RequireJS的`domReady`模块可解决此问题，下载后可以按如下方法之一使用：

```javascript
require(['domReady'], function(domReady) {
    domReady(function () {
    // 此处为onload事件监听函数的内容
  });
});
require(['domReady!'], function(doc) {
    // 此处语句也会在DOM加载完毕后运行
    // 注意'domReady!'模块的返回值为document对象
});
```