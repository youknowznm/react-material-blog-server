/*
 * protoQuery lib
 * https://github.com/youknowznm/zQuery
 *
 * 2017-05-18
 */

(function(wd) {

    const NUMBER_TYPE_STYLE_NAMES = ['opacity'];
    const FLOAT_TYPE_STYLE_NAMES = ['opacity'];

    let zQueryUtil = {
        onGoingAnimations: {},
    };

    /////////////////////////////////////////////
    /////////////////  基本方法  /////////////////
    /////////////////////////////////////////////

    // 判断单个节点是否符合单个选择器
    let nodeMatchesSelector = function(tarNode, selector) {
        if (!tarNode instanceof Node) {
            throw new Error('Expected NODE as target node.');
        }
        if (typeof selector !== 'string' || selector === '') {
            throw new Error('Expected STRING as selector.');
        }
        switch (true) {
            // id选择器
            case /^#([\w-]+)$/.test(selector):
                return tarNode.id === RegExp.$1;
                // 类选择器，支持多个类
            case /^\.([\w-\.]+)$/.test(selector):
                let tarClasses = RegExp.$1.split('.');
                let thisNodeMatches = false;
                for (let tarClass of tarClasses) {
                    thisNodeMatches = true;
                    if (!tarNode.hasClass(tarClass)) {
                        thisNodeMatches = false;
                        break;
                    }
                }
                return thisNodeMatches;
                // 标签类型选择器
            case /^[\w]+$/.test(selector):
                return tarNode.nodeName === selector.toUpperCase();
                // 属性选择器，存在时
            case /^\[([\w-]+)\]$/.test(selector):
                return tarNode.hasAttribute(RegExp.$1);
                // 属性选择器，为指定值时（值之间不能有空格）
            case /^\[([\w-]+)=([\w-]+)\]$/.test(selector):
                return tarNode.getAttribute(RegExp.$1) === RegExp.$2;
                // 选择器为*时直接返回真
            case selector === '*':
                return true;
            default:
                throw new Error('Invalid selector string.');
        }
    };

    // 根据［单个］选择器字符串查询，返回目标元素下［所有］符合的元素
    // @param {string} selector "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式的［单个］查询字符串
    // @param {node?} root 提供时以其为遍历起点，否则以document为起点
    // @return {array.<node>} 返回成员类型为node的数组或空数组
    let singleSelectorAllResults = function(selector, root) {
        if (root === undefined) {
            return [];
        }
        let result = [];
        // #01 TreeWalker实例在遍历时并不会计算根节点，因此在这里添加对根节点的判定
        if (nodeMatchesSelector(root, selector)) {
            result.push(root);
        }
        let walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
        let currentNode = walker.nextNode();
        while (currentNode !== null) {
            if (nodeMatchesSelector(currentNode, selector)) {
                result.push(currentNode);
            }
            currentNode = walker.nextNode();
        }
        return result;
    };

    // 根据［组合］选择器字符串查询，返回目标元素下［所有］符合的元素
    // @param {string} selectorGroup "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式以空格连接的查询字符串
    // @return {array.<node>} 返回成员类型为node的数组或空数组
    let groupSelectorAllResults = function(selectorGroup, root) {
        let selectorArr = selectorGroup.split(' ');
        let r1, r2, r3;
        switch (selectorArr.length) {
            case 1:
                return singleSelectorAllResults(selectorArr[0], root);
            case 2:
                r1 = singleSelectorAllResults(selectorArr[0], root)[0];
                return singleSelectorAllResults(selectorArr[1], r1);
            case 3:
                r1 = singleSelectorAllResults(selectorArr[0], root)[0];
                r2 = singleSelectorAllResults(selectorArr[1], r1)[0];
                return singleSelectorAllResults(selectorArr[2], r2);
            case 4:
                r1 = singleSelectorAllResults(selectorArr[0], root)[0];
                r2 = singleSelectorAllResults(selectorArr[1], r1)[0];
                r3 = singleSelectorAllResults(selectorArr[2], r2)[0];
                return singleSelectorAllResults(selectorArr[3], r3);
            default:
                throw new Error('Expected at most 4 selector snippets.');
        }
    };

    // 在单一元素上添加/删除单一监听函数
    // @param {node} ele 目标元素节点
    // @param {string} evts 单一或多个目标事件
    // @param {function} fn 监听函数
    // @param {object} options 'method'为'add'或'remove'；提供'delegationSelector'时代理监听
    let handleSingleListener = function(ele, evts, fn, options) {
        if (ele.nodeType !== 1) {
            throw new Error('Expected ELEMENT NODE as target.')
        }
        if (typeof evts !== 'string') {
            throw new Error('Expected STRING as target event(s).')
        }
        if (typeof fn !== 'function') {
            throw new Error('Expected FUNCTION as event listener.')
        }
        let handleEachEvent = null;
        switch (options.method) {
            case 'add':
                if (options.delegationSelector !== undefined) {
                    handleEachEvent = function(evtName) {
                        ele.addEventListener(
                            evtName,
                            function(evtObj) {
                                if (evtObj.target.is(options.delegationSelector)) {
                                    fn.call(this, evtObj);
                                }
                            },
                            false
                        );
                    };
                } else {
                    handleEachEvent = function(evtName) {
                        ele.addEventListener(evtName, fn, false);
                    };
                }
                break;
            case 'remove':
                handleEachEvent = function(evtName) {
                    ele.removeEventListener(evtName, fn, false);
                };
                break;
        }
        let targetEvents = evts.split(/\s/);
        for (let evt of targetEvents) {
            handleEachEvent(evt);
        }
    };

    // 基本动画
    // @param {node} ele 目标元素
    // @param {string} tarStyle 目标样式名
    // @param {string} tarValue 目标样式值
    // @return {number} cycleId 动画标识id
    let transformSingleRule = function(ele, tarStyle, tarValue) {
        let fullStyleValue = ele.css(tarStyle);
        let currentValue = parseFloat(fullStyleValue);
        if (!isFinite(currentValue)) {
            throw new Error('Expected a number-type style value.');
        }
        if (FLOAT_TYPE_STYLE_NAMES.indexOf(tarStyle) > -1) {
            currentValue *= 100;
            tarValue *= 100;
        }
        // #02 开始忽略了负值的情况
        let styleSuffix = fullStyleValue.match(/^[-\d]+(.*)$/)[1] || '';
        let cycleId = setInterval(function() {
            switch (true) {
                case currentValue < tarValue:
                    currentValue += Math.ceil((tarValue - currentValue) / 10);
                    break;
                case currentValue > tarValue:
                    currentValue -= Math.ceil((currentValue - tarValue) / 10);
                    break;
                default:
                    zQueryUtil.onGoingAnimations[cycleId] = true;
                    clearInterval(cycleId);
            }
            if (FLOAT_TYPE_STYLE_NAMES.indexOf(tarStyle) > -1) {
                ele.css(tarStyle, currentValue / 100);
            } else {
                ele.css(tarStyle, currentValue + styleSuffix);
            }
        }, 20);
        zQueryUtil.onGoingAnimations[cycleId] = false;
        return cycleId;
    };

    /////////////////////////////////////////////
    //////////////  处理window对象  //////////////
    /////////////////////////////////////////////

    // 在文档渲染结束、即将加载内嵌资源时，执行指定函数
    wd.domReady = function(fn) {
        document.onreadystatechange = function() {
            if (document.readyState === 'interactive') {
                fn();
            }
        };
    };

    // 浏览器为移动端时设置全局变量isMobile为真，否则为假；并返回该值
    wd.detectMobile = function() {
        let ua = wd.navigator.userAgent;
        let result =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Mobile|UCWeb/i
            .test(ua) ? true : false;
        wd.isMobile = result;
        return result;
    };

    // 判断目标对象是否为空对象（不是null）
    // @param {object} target 目标对象
    // @param {boolean?} shoudlIncludeInherited 为真时，考虑继承来的属性
    wd.isEmpty = function(target, shoudlIncludeInherited) {
        switch (shoudlIncludeInherited) {
            case true:
                for (let anyKey in target) {
                    return false;
                }
                return true;
            default:
                for (let anyKey in target) {
                    if (target.hasOwnProperty(anyKey)) {
                        return false;
                    }
                }
                return true;
        }
    };

    // 复制原始类型值或一般对象
    wd.clone = function(source) {
        let result;
        switch (typeof target) {
            case 'boolean':
            case 'number':
            case 'string':
                result = source;
                break;
            case 'object':
                switch (true) {
                    case (source instanceof Date):
                        result = new Date(source.getTime());
                        break;
                    case (Array.isArray(source)):
                        result = [];
                        for (let key in source) {
                            result[key] = clone(source[key]);
                        }
                        break;
                    default:
                        result = {};
                        for (let prop in source) {
                            result[prop] = clone(source[prop]);
                        }
                }
            default:
                throw new Error('Interesting input: ' + ((typeof target) + ''));
        }
    };

    // 返回去重的新数组（限定为基本类型值组成），原数组未改动
    wd.uniq = function(arr) {
        // es5的笨方法
        // if (!Array.isArray(arr)) {
        //   throw new Error('Expected ARRAY to process.');
        // }
        // let result = [];
        // for (let item of arr) {
        //   if (result.indexOf(item) === -1) {
        //     result.push(currentItem);
        //   }
        // }
        // return result;
        return Array.from(new Set(arr));
    };

    // 读写cookie
    //  1 arg
    //  @param {string} arg1 目标cookie名
    //  @return {string} cookie值或空字符串
    //  2 arg
    //  @param {string} arg1 目标cookie名
    //  @param {string} arg2 目标cookie值
    //  3 arg
    //  @param {string} arg1 目标cookie名
    //  @param {string} arg2 目标cookie值
    //  @param {number} arg3 有效天数
    wd.cookie = function(arg1, arg2, ar3) {
        switch (arguments.length) {
            case 1:
                if (typeof arg1 !== 'string') {
                    throw new Error('Expected STRING as target cookie name.');
                }
                let cookieStr = document.cookie;
                let start = cookieStr.indexOf(encodeURIComponent(arg1) + '=');
                if (start > -1) {
                    let semicolonPos = cookieStr.indexOf(';', start);
                    let end = semicolonPos === -1 ? cookieStr.length : semicolonPos;
                    let rawCookieValue = cookieStr.slice(start, end).match(/=(.*)/)[1];
                    return decodeURIComponent(rawCookieValue);
                }
                return '';
            default:
                if (typeof arg1 !== 'string') {
                    throw new Error('Expected STRING as target cookie name.');
                }
                if (typeof arg2 !== 'string') {
                    throw new Error('Expected STRING as target cookie value.');
                }
                let cookieText = encodeURIComponent(arg1) + '=' + encodeURIComponent(arg2);
                if (ar3 !== undefined) {
                    if (typeof ar3 !== 'number') {
                        throw new Error('Expected NUMBER as expire day (if provided).');
                    }
                    let expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + ar3);
                    cookieText = cookieText + '; expires=' + expireDate.toUTCString();
                }
                document.cookie = cookieText;
        }
    };

    // 简易ajax方法
    // @param {string} url 目标url
    // @param {object} options 选项对象，应包含发送类型、数据（对象或查询字符串）、成功函数和失败函数
    wd.ajax = function(url, {type = 'GET'}) {
        let data;
        switch (typeof options.data) {
            case 'string':
                data = encodeURIComponent(options.data);
                break;
            case 'object':
                let dataArr = [];
                for (let key in options.data) {
                    dataArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(options.data[key]));
                }
                data = dataArr.join('&');
                break;
            default:
                throw new Error('Expected STRING or OBJECT as data to send.');
        }
        let onDone =
            typeof options.onDone === 'function'
            ? options.onDone
            : function(res) {
                console.log('XHR done. res:' + res);
            };
        let onFail =
            typeof options.onFail === 'function'
            ? options.onFail
            : function(res) {
                console.log('XHR fail. res:' + res);
            };
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    onDone(xhr.responseText);
                } else {
                    onFail(this.status);
                }
            }
        };
        switch (type.toUpperCase()) {
            case 'GET':
                xhr.open('GET', url + '?' + data, true);
                xhr.send();
                break;
            case 'POST':
                xhr.open('POST', url, true);
                xhr.send(data);
                break;
        }
    };

    /////////////////////////////////////////////
    ///////////////  处理node原型  ///////////////
    /////////////////////////////////////////////

    (function(nodePrototype) {

        ///////////////  样式和属性  ///////////////

        nodePrototype.hasClass = function(tarClassName) {
            if (typeof tarClassName !== 'string') {
                throw new Error('Expected STRING as target class name.');
            }
            var classArr = this.className.split(/\s+/);
            if (classArr[0] !== '') {
                if (classArr.indexOf(tarClassName) !== -1) {
                    return true;
                }
            }
            return false;
        };

        // 为目标元素添加指定类
        nodePrototype.addClass = function(tarClassName) {
            if (typeof tarClassName !== 'string') {
                throw new Error('Expected STRING as target class name.');
            }
            if (!this.hasClass(tarClassName)) {
                this.className = this.className.concat(' ' + tarClassName.trim());
            }
            return this;
        };

        // 为目标元素移除指定类
        nodePrototype.removeClass = function(tarClassName) {
            if (typeof tarClassName !== 'string') {
                throw new Error('Expected STRING as target class name.');
            }
            if (this.hasClass(tarClassName)) {
                let classArr = this.className.split(/\s+/);
                classArr.splice(classArr.indexOf(tarClassName), 1);
                this.className = classArr.join(' ');
            }
            return this;
        };

        // 目标元素含指定类时移除，否则添加
        nodePrototype.toggleClass = function(tarClassName) {
            if (typeof tarClassName !== 'string') {
                throw new Error('Expected STRING as target class name.');
            }
            if (this.hasClass(tarClassName)) {
                this.removeClass(tarClassName);
            } else {
                this.addClass(tarClassName);
            }
            return this;
        };

        // 设置或读取目标元素的样式
        // @param {string|object} arg1 只提供此参数：为数值时返回该样式值；为对象时设置元素的多条规则
        // @param {string|number?} arg2 提供时设置指定样式的值
        // @return {node|string|null} 读取时返回字符串或null；设置时返回自身
        nodePrototype.css = function(arg1, arg2) {
            let changeSingleRule = function(name, value) {
                if (/^.*\d$/.test(value) && NUMBER_TYPE_STYLE_NAMES.indexOf(name) === -1) {
                    value += 'px';
                }
                this.style[name] = value;
            };
            switch (arguments.length) {
                case 0:
                    throw new Error('Expected at least 1 argument.');
                case 1:
                    switch (typeof arg1) {
                        case 'string':
                            // #03 对值为auto的样式，似乎chrome懂事儿地返回了0px，safari返回auto。
                            let rawResult = document.defaultView.getComputedStyle(this, null)[arg1] || null;
                            return rawResult === 'auto' ? '0px' : rawResult;
                        case 'object':
                            for (var i in arg1) {
                                changeSingleRule.call(this, i, arg1[i]);
                            }
                            return this;
                        default:
                            throw new Error('Expected STRING as target style name or OBJECT as style group.');
                    }
                case 2:
                    switch (typeof arg2) {
                        case 'string':
                        case 'number':
                            changeSingleRule.call(this, arg1, arg2 + '');
                            return this;
                        default:
                            throw new Error(
                                'Expected STRING or NUMBER as target style value.');
                    }
                default:
                    throw new Error('Expected 1~2 arguments.');
            }
        };

        // 渐变目标的一个或多个样式
        //  @param {object} arg1 键：样式名；值：样式值
        //  @param {function?} arg2 完成后的回调函数
        nodePrototype.transform = function(styleObj, callback) {
            if (typeof styleObj !== 'object') {
                throw new Error('Expected PLAIN OBJECT containing style key-value pairs.');
            }
            let animationIdGruop = [];
            for (var i in styleObj) {
                let id = transformSingleRule(this, i, styleObj[i]);
                animationIdGruop.push(id);
            }
            if (typeof callback === 'function') {
                let callbackId = setInterval(function() {
                    for (var j in animationIdGruop) {
                        if (zQueryUtil.onGoingAnimations[animationIdGruop[j]] ===
                            false) {
                            return;
                        }
                    }
                    clearInterval(callbackId);
                    callback();
                }, 5);
            }
            return this;
        };

        // 返回元素相对于父定位元素之坐标
        nodePrototype.position = function() {
            let top = this.offsetTop,
                left = this.offsetLeft;
            return {top, left};
        };

        // 返回元素相对于浏览器窗口之坐标
        nodePrototype.offset = function() {
            let top = this.offsetTop;
            let left = this.offsetLeft;
            let posParent = this.offsetParent;
            while (posParent !== null) {
                top += posParent.offsetTop;
                left += posParent.offsetLeft;
                posParent = posParent.offsetParent;
            }
            return {top, left};
        };

        // 获取或设置目标属性
        // @param {string} tarAttr 目标属性名
        // @param {string} tarValue 目标属性值
        // @return {string|null|object.node} 获取时返回字符串或null；设置时返回自身
        nodePrototype.attr = function(tarAttr, tarValue) {
            if (typeof tarAttr !== 'string') {
                throw new Error('Expected STRING as target attribute name.')
            }
            if (tarValue === undefined) {
                return this.getAttribute(tarAttr);
            } else {
                if (typeof tarValue !== 'string') {
                    throw new Error(
                        'Expected STRING as target attribute value (if provided).');
                } else {
                    this.setAttribute(tarAttr, tarValue);
                    return this;
                }
            }
        };

        // 获取或设置目标的innerHTML
        nodePrototype.html = function(tarHTML) {
            if (tarHTML === undefined) {
                return this.innerHTML;
            }
            this.innerHTML = tarHTML;
            return this;
        };

        ///////////////  选择和遍历  ///////////////

        // 根据组合选择器字符串查询，返回元素下所有符合的元素
        // @param {string} selectorGroup "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式以空格连接的查询字符串
        // @return {array.<node>} 返回成员类型为node的数组或空数组
        nodePrototype.protoQueryAll = function(selectorGroup) {
            return groupSelectorAllResults(selectorGroup, this);
        };

        // 根据组合选择器字符串查询，返回元素下第一个符合的元素或null
        // @param {string} selectorGroup "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式以空格连接的查询字符串
        // @return {node | null} 返回Node实例或null
        nodePrototype.protoQuery = function(selectorGroup) {
            return groupSelectorAllResults(selectorGroup, this)[0] || null;
        };

        // 目标元素本身符合字符串时返回真
        nodePrototype.is = function(selector) {
            return nodeMatchesSelector(this, selector);
        };

        // 在当前元素的第一个子元素前插入目标元素
        // @return {node} 插入的新元素节点
        nodePrototype.prependChild = function(tarNode) {
            if (tarNode.nodeType !== 1) {
                throw new Error('Expected ELEMENT NODE as target node.')
            }
            this.insertBefore(tarNode, this.firstElementChild);
            return tarNode;
        };

        // @param {node} newNode 新元素节点
        // @param {node} referenceNode 比照元素节点
        // @return {node} 插入的新元素节点
        nodePrototype.insertAfter = function(newNode, referenceNode) {
            if (newNode.nodeType !== 1) {
                throw new Error('Expected ELEMENT NODE as target node.')
            }
            if (referenceNode.nodeType !== 1) {
                throw new Error('Expected ELEMENT NODE as reference node.')
            }
            if (this.lastElementChild === referenceNode) {
                this.appendChild(newNode);
            } else {
                this.insertBefore(newNode, referenceNode.nextElementSibling);
            }
            return newNode;
        };

        // 返回目标元素的直接父元素
        // @return {node} 元素节点或null
        nodePrototype.parent = function() {
            let tarElement = this.parentNode;
            while (true) {
                if (tarElement === null || tarElement.nodeType === 1) {
                    return tarElement;
                } else {
                    tarElement = tarElement.parentNode;
                }
            }
        };

        // 返回目标元素的所有符合参数条件的父元素
        // @return {array.<node>} 元素节点对象构成之数组
        nodePrototype.matchedParents = function(selector) {
            let result = [];
            let currentNode = this.parent();
            while (currentNode !== null) {
                if (nodeMatchesSelector(currentNode, selector)) {
                    result.push(currentNode);
                }
                currentNode = currentNode.parent();
            }
            return result;
        };

        // 返回目标元素的不符合参数条件的所有父元素
        // @return {array.<node>} 元素节点对象构成之数组
        nodePrototype.parentsUntil = function(selector) {
            let result = [];
            let currentNode = this.parent();
            while (currentNode !== null) {
                if (!nodeMatchesSelector(currentNode, selector)) {
                    result.push(currentNode);
                } else {
                    break;
                }
                currentNode = currentNode.parent();
            }
            return result;
        };

        // 返回目标元素的符合参数条件的最近的父元素，遍历包含元素自身
        // @return {node} 元素节点或null
        nodePrototype.closest = function(selector) {
            let currentNode = this;
            while (currentNode !== null) {
                if (nodeMatchesSelector(currentNode, selector)) {
                    return currentNode;
                } else {
                    currentNode = currentNode.parent();
                }
            }
            return null;
        };

        // 返回目标元素的符合参数条件的直接子元素
        // @return {array.<node>} 元素节点对象构成之数组
        nodePrototype.matchedChildren = function(selector) {
            let result = [];
            for (var child of this.childNodes) {
                if (child.nodeType === 1 && nodeMatchesSelector(child, selector)) {
                    result.push(child);
                }
            }
            return result;
        };

        // 返回目标元素之前的符合参数条件的最近的兄弟元素
        // @return {node} 元素节点或null
        nodePrototype.prev = function(selector) {
            let prevSib = this.previousElementSibling;
            while (prevSib !== null) {
                if (nodeMatchesSelector(prevSib, selector)) {
                    return prevSib;
                }
                prevSib = prevSib.previousElementSibling;
            }
            return null;
        };

        // 返回目标元素之后的符合参数条件的最近的兄弟元素
        // @return {node} 元素节点或null
        nodePrototype.next = function(selector) {
            let nextSib = this.nextElementSibling;
            while (nextSib !== null) {
                if (nodeMatchesSelector(nextSib, selector)) {
                    return nextSib;
                }
                nextSib = nextSib.nextElementSibling;
            }
            return null;
        };

        // 返回位于目标元素之前的所有符合参数条件的兄弟元素
        // @return {array.<node>} 元素节点对象构成之数组
        nodePrototype.prevAll = function(selector) {
            let result = [];
            let prevSib = this.previousElementSibling;
            while (prevSib !== null) {
                if (nodeMatchesSelector(prevSib, selector)) {
                    result.unshift(prevSib);
                }
                prevSib = prevSib.previousElementSibling;
            }
            return result;
        };

        // 返回位于目标元素之后的所有符合参数条件的兄弟元素
        // @return {array.<node>} 元素节点对象构成之数组
        nodePrototype.nextAll = function(selector) {
            let result = [];
            let nextSib = this.nextElementSibling;
            while (nextSib !== null) {
                if (nodeMatchesSelector(nextSib, selector)) {
                    result.push(nextSib);
                }
                nextSib = nextSib.nextElementSibling;
            }
            return result;
        };

        // 返回目标元素的所有符合参数条件的兄弟元素
        // @return {array.<node>} 元素节点对象构成之数组
        nodePrototype.siblings = function(selector) {
            return this.prevAll(selector).concat(this.nextAll(selector));
        };

        // 返回目标元素之前、符合参数条件的元素（如有）之后的所有兄弟元素
        // @return {array.<node>} 元素节点对象构成之数组
        nodePrototype.prevUntil = function(selector) {
            let result = [];
            let prevSib = this.previousElementSibling;
            while (prevSib !== null) {
                if (nodeMatchesSelector(prevSib, selector)) {
                    break;
                }
                result.unshift(prevSib);
                prevSib = prevSib.previousElementSibling;
            }
            return result;
        };

        // 返回目标元素之后、符合参数条件的元素（如有）之前的所有兄弟元素
        // @return {array.<node>} 元素节点对象构成之数组
        nodePrototype.nextUntil = function(selector) {
            let result = [];
            let nextSib = this.nextElementSibling;
            while (nextSib !== null) {
                if (nodeMatchesSelector(nextSib, selector)) {
                    break;
                }
                result.push(nextSib);
                nextSib = nextSib.nextElementSibling;
            }
            return result;
        };

        ///////////////  事件  ///////////////

        // 添加事件监听
        //  1 arg
        //  @param {object} arg1 键：一个或多个事件名；值：该事件的监听函数
        //  2 arg
        //  @param {string} arg1 一个或多个事件名
        //  @param {function} arg2 监听函数
        //  3 arg
        //  @param {string} arg1 一个或多个事件名
        //  @param {string} arg2 被代理者的选择字符串
        //  @param {function} arg3 监听函数
        nodePrototype.on = function(arg1, arg2, arg3) {
            switch (arguments.length) {
                case 1:
                    if (typeof arg1 !== 'object') {
                        throw new Error(
                            'Expected PLAIN OBJECT if only 1 argument is provided.'
                        );
                    }
                    for (var i in arg1) {
                        handleSingleListener(this, i, arg1[i], {
                            method: 'add'
                        });
                    }
                    return this;
                case 2:
                    if (typeof arg1 !== 'string') {
                        throw new Error('Expected STRING as target event(s)\' name.');
                    }
                    if (typeof arg2 !== 'function') {
                        throw new Error('Expected FUNCTION as target event listener.');
                    }
                    handleSingleListener(this, arg1, arg2, {
                        method: 'add'
                    });
                    return this;
                case 3:
                    if (typeof arg1 !== 'string') {
                        throw new Error('Expected STRING as target event(s)\' name.');
                    }
                    if (typeof arg2 !== 'string') {
                        throw new Error(
                            'Expected STRING as selector for delegated elements.');
                    }
                    if (typeof arg3 !== 'function') {
                        throw new Error('Expected FUNCTION as target event listener.');
                    }
                    handleSingleListener(this, arg1, arg3, {
                        method: 'add',
                        delegationSelector: arg2
                    });
                    return this;
                default:
                    throw new Error('Expected 1~3 arguments.');
            }
        };

        // 移除事件监听。未提供代理移除的方法
        //  1 arg
        //  @param {object} arg1 键：一个或多个事件名；值：该事件的监听函数
        //  2 arg
        //  @param {string} arg1 一个或多个事件名
        //  @param {function} arg2 监听函数
        nodePrototype.off = function(arg1, arg2) {
            switch (arguments.length) {
                case 1:
                    if (typeof arg1 !== 'object') {
                        throw new Error(
                            'Expected PLAIN OBJECT if only 1 argument is provided.'
                        );
                    }
                    for (var i in arg1) {
                        handleSingleListener(this, i, arg1[i], {
                            method: 'remove'
                        });
                    }
                    return this;
                case 2:
                    if (typeof arg1 !== 'string') {
                        throw new Error('Expected STRING as target event(s)\' name.');
                    }
                    if (typeof arg2 !== 'function') {
                        throw new Error('Expected FUNCTION as target event listener.');
                    }
                    handleSingleListener(this, arg1, arg2, {
                        method: 'remove'
                    });
                    return this;
                default:
                    throw new Error('Expected 1~2 arguments.');
            }
        };

        ///////////////  捷径  ///////////////

        // 读写元素自身的宽/高
        nodePrototype.width = function(value) {
            return value === undefined ? parseInt(this.css('width')) : this.css('width', value);
        };
        nodePrototype.height = function(value) {
            return value === undefined ? parseInt(this.css('height')) : this.css('height', value);
        };
        // 获取元素的自身宽/高 + 内边距
        nodePrototype.innerWidth = function() {
            return this.width()
                + parseInt(this.css('paddingLeft'))
                + parseInt(this.css('paddingRight'));
        };
        nodePrototype.innerHeight = function() {
            return this.height()
                + parseInt(this.css('paddingTop'))
                + parseInt(this.css('paddingBottom'));
        };
        // 获取元素的自身宽/高 + 内边距 + 边框，参数为真时包括外边距
        nodePrototype.outerWidth = function(includeMargin) {
            let r = this.innerWidth()
                + parseInt(this.css('borderLeftWidth'))
                + parseInt(this.css('borderRightWidth'));
            if (includeMargin === true) {
                r += parseInt(this.css('marginLeft')) + parseInt(this.css('marginRight'));
            }
            return r;
        };
        nodePrototype.outerHeight = function(includeMargin) {
            let r = this.innerHeight()
                + parseInt(this.css('borderTopWidth'))
                + parseInt(this.css('borderBottomWidth'));
            if (includeMargin === true) {
                r += parseInt(this.css('marginTop')) + parseInt(this.css('marginBottom'));
            }
            return r;
        };
        // 显示/隐藏元素。参数为'transform'时从左上角开始动画，否则即时
        nodePrototype.show = function(option) {
            if (this.css('display') === 'none') {
                switch (option) {
                    case 'transform':
                        let initWidth = parseInt(this.width());
                        let initHeight = parseInt(this.height());
                        this.css({
                            display: 'block',
                            width: 0,
                            height: 0
                        });
                        this.transform({
                            width: initWidth,
                            height: initHeight
                        });
                        break;
                    default:
                        this.css('display', 'block');
                }
            }
            return this;
        };
        nodePrototype.hide = function(option) {
            if (this.css('display') !== 'none') {
                switch (option) {
                    case 'transform':
                        this.transform({
                            width: 0,
                            height: 0
                        });
                        break;
                    default:
                        this.css('display', 'none');
                }
            }
            return this;
        };
        // 渐变透明度以显示/隐藏元素
        nodePrototype.fadeIn = function() {
            if (this.css('display') === 'none') {
                this.css({
                    opacity: 0,
                    display: 'block',
                });
                this.transform({
                    opacity: 1
                });
            }
            return this;
        };
        nodePrototype.fadeOut = function() {
            if (this.css('display') !== 'none') {
                this.transform({
                    'opacity': 0
                }, function() {
                    this.hide();
                });
            }
            return this;
        };
        // 渐变高度以显示/隐藏元素
        nodePrototype.slideDown = function() {
            if (this.css('display') === 'none') {
                let initHeight = this.height();
                this.css({
                    height: 0,
                    display: 'block',
                });
                this.transform({
                    height: initHeight
                });
            }
            return this;
        };
        nodePrototype.slideUp = function() {
            if (this.css('display') !== 'none') {
                let that = this;
                this.transform({
                    'height': 0
                }, function() {
                    that.hide();
                });
            }
            return this;
        };

    })(wd.Node.prototype);

    /////////////////////////////////////////////
    ///////////////  处理string原型  //////////////
    /////////////////////////////////////////////

    (function(stringPrototype) {

        // 去除字符串首尾的空格
        stringPrototype.trim = function() {
            return this.replace(/^\s+|\s+/g, '');
        };

        // 判断字符串是否符合常见邮箱格式
        stringPrototype.isEmail = function() {
            return /^([a-zA-Z\d]+)\w@(\w+)(\.[a-zA-Z]{2,}) {1,2}$/.test(this);
        };

        // 判断字符串是否为有效日期，无法判断闰年
        stringPrototype.isValidDate = function() {
            if ((/^([012]\d\d\d)-(([01]\d)-([0123]\d))$/).test(this)) {
                let y = +RegExp.$1;
                let m = +RegExp.$3;
                let d = +RegExp.$4;
                let md = RegExp.$2;
                if (y !== 0 && m !== 0 && d !== 0) {
                    if (y < 2100 && m < 13 && d < 32) {
                        if (['02-30', '02-31', '04-31', '06-31', '09-31', '11-31'].indexOf(
                                md) === -1) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };

    })(wd.String.prototype);

})(window);

// export let protoQuery = 'protoQuery';