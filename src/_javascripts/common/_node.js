export default function handleNodePrototype(nodePrototype) {

    ///////////////  样式和属性  ///////////////

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
        let animationIdGroup = [];
        for (var i in styleObj) {
            console.log(i);
            console.log(styleObj[i]);
            let id = transformSingleRule(this, i, styleObj[i]);
            animationIdGroup.push(id);
        }
        if (typeof callback === 'function') {
            let callbackId = setInterval(function() {
                for (var j in animationIdGroup) {
                    if (zQueryUtil.onGoingAnimations[animationIdGroup[j]] ===
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

    // 获取或设置目标的文字内容
    nodePrototype.text = function(tarText) {
        if (tarHTML === undefined) {
            return this.textContent;
        }
        this.textContent = tarText;
        return this;
    };

    ///////////////  选择和遍历  ///////////////

    // 根据组合选择器字符串查询，返回元素下所有符合的元素
    // @param {string} selectorGroup "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式以空格连接的查询字符串
    // @return {array.<node>} 返回成员类型为node的数组或空数组
    nodePrototype.protoQuery = function(selectorGroup) {
        return multiQuery(selectorGroup, this);
    };

    // 目标元素本身符合字符串时返回真
    nodePrototype.is = function(selector) {
        return nodeMatchesSelector(this, selector);
    };

    // 在当前元素的第一个子元素前插入目标元素
    // @return {node} 插入的新元素节点
    nodePrototype.prepend = function(tarNode) {
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
    nodePrototype.parents = function(selector) {
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
    nodePrototype.children = function(selector) {
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
        console.log(1,value);
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

};