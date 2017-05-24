---
layout: default
title: JS - 原型
---

- 可称将参数传给内部`this`对象作为其属性的函数为`构造函数（constructor）`。构造函数命名的最佳实践是首字母大写，但这不是强制的。对其使用`new`即产生其实例对象；不`new`而是直接调用时，由于无明确的当前执行对象，`this`变量指向了`window`，于是想赋给实例的属性全部变成了全局变量。

```javascript
var A = function() { var p; }
// A的构造函数
A.constructor === function Function() { [native code] }
// A的__proto__
A.__proto__ === function() {}
A.constructor.prototype === function() {}
// A的prototype
A.prototype === Object {}

var a = new A();`
// 实例a的构造函数
a.constructor === function() { var p; }
x
// 实例a的__proto__
a.__proto__ === Object {}
a.constructor.prototype === Object {}
// 实例a的prototype
a.prototype === undefined
```

- 函数的`prototype`是一个对象（默认只有一个指向构造函数自身的`constructor`属性），当这个函数被用作构造函数来创建实例时，其`prototype`将被作为`__proto__`赋值给所有对象实例。

- 定义`prototype`的过程实际上就是将该构造函数之实例的`__proto__`指向某一结构体的过程，该属性等于其构造函数的原型属性，默认指向`Object`。

- 除了`Object.prototype`， 所有对象的`__proto__`引用其构造函数的`prototype`。

- 遍历对象属性时一般应使用`hasOwnProperty()`过滤掉继承自原型链的属性。

- 继承另一函数的实例时（如将构造函数A的原型改为构造函数B的实例），会将A的`constructor`也改为构造函数B，此时必须将A的`constructor`改回来。