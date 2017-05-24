---
layout: default
title: VueJS - 组件
---

全部整理自[VueJS教程](http://vuejs.org.cn/guide)。

### 组件
- 组件可用于扩展HTML元素和代码重用。组件是自定义元素或原生HTML元素，在初始化前必须注册
    * 最佳实践是以`全部小写并包含一个短杠`的格式命名组件
- 可用选项对象代替构造器名，作为参数或属性传入以上两个方法
    * 此时选项对象中如有`el`或`data`对象，应将其值改为`以该对象为返回值的函数`，否则该构造器的所有实例都会共享同一个`data`对象
- 全局注册 - 通过`Vue.extend()`方法创建构造器后，使用`Vue.component(组件名, 构造器名)`注册
- 局部注册 - 给`Vue.extend()`传入`components`参数

```javascript
/*
@param {object} options
    template {=string} 用于替换自定义元素的innerHTML
    components {=object} 局部注册当前组件的子组件时传入。属性名为[子组件名]，值为[子组件构造器]
    props {=array.<string>} 规定可父组件继承的数据
*/
Vue.extend(options){}
```

- 组件实例的作用域是孤立的。可通过选项对象中的`props`规定可继承的数据
    * 其中的数据用作HTML特性时应转化为短杠连接的全部小写格式
    * 可使用`v-bind`动态绑定`prop`
        - 用字面量语法传递的数值会被看作字符串。为使此值作为JS表达式计算，应动态绑定
    * 默认情况下，`prop`为单向绑定，以防数据被子组件无意修改。可使用`.sync`修饰符双向绑定或用`.once`单次双向绑定
        - 类似于原生JS，当`prop`为对象或数组时其值按引用传递，此时绑定永远为双向
    * 可为`prop`指定验证要求，此时`props`为一个对象，举例如下

```javascript
Vue.component('example', {
    props: {
        // 基础类型检测 （`null` 意思是任何类型都可以）
        propA: Number,
        // 多种类型
        propM: [String, Number],
        // 必需且是字符串
        propB: {
            type: String,
            required: true
        },
        // 数字，有默认值
        propC: {
            type: Number,
            default: 100
        },
        // 对象/数组的默认值应当由一个函数返回
        propD: {
            type: Object,
            default: function () {
                return { msg: 'hello' }
            }
        },
        // 指定这个 prop 为双向绑定
        // 如果绑定类型不对将抛出一条警告
        propE: {
            twoWay: true
        },
        // 自定义验证函数
        propF: {
            validator: function (value) {
                return value > 10
            }
        },
        // 转换函数
        // 在设置值之前转换值
        propG: {
            coerce: function (val) {
                return val + '' // 将值转换为字符串
            }
        },
        propH: {
            coerce: function (val) {
                return JSON.parse(val) // 将 JSON 字符串转换为对象
            }
        }
    }
});
```

### 父子组件通信

- 子组件可以用`this.$parent`访问它的父组件。根实例的后代可以用`this.$root`访问它。父组件的`this.$children`数组包含它所有的子元素
    * 子组件可以访问父链上的任意实例，但应尽量显示使用`props`传递数据
    * 为避免父子组件的紧密耦合，应只允许组件修改自己的状态
- 自定义事件（待补充）

### 内容分发

- 指`父组件的内容`和`子组件的模板`的组合过程。
    * **父组件模板的内容只在父组件作用域内编译；子组件模板的内容只在子组件作用域内编译**
- 子组件模板中存在`<slot>`标签时，可将父组件的内容填充其中
    * `slot`的内容在宿主元素为空且无内容供插入时显示
    * 无特性的`slot`将被父组件的所有内容替换
    * 包含`name`特性的`slot`将匹配内容片段中包含对应`slot`特性的元素
        - 此时仍允许存在一个无特性`slot`，其内容将被找不到匹配的内容片段替换
- 通过将多个组件定义为`components`对象的属性，可使它们共享同一个挂载点（即用于替换内容的自定义元素）
    * 使用元素的`is`特性动态切换组件
    * 为元素添加`keep-alive`特性，可保留其状态或避免重新渲染
    * 默认情况下，组件的切换以平滑的过渡体现。可为`transition-mode`设置`in-out`或`out-in`以更改之
    * （待补充）

### 杂项
- `v-for`也适用于自定义组件，但无法传递数据，因为组件的作用域是孤立的。应使用`props`动态传递数据
- （待补充）
    