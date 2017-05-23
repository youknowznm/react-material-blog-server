export default function handleBasic(wd) {

    //////////// 类相关 ////////////

    let nodePrototype = wd.Node.prototype;

    // 检查目标元素是否包含所有的类名
    nodePrototype.hasClass = function(tarClassesStr) {
        if (typeof tarClassesStr !== 'string' || /^\s*$/.test(tarClassesStr)) {
            throw new Error('Expected non-empty STRING as target class name(s).');
        }
        let tarClassesArr = tarClassesStr.split(/\s+/);
        let eleClassesArr = this.className.split(/\s+/);
        let allMatch = true;
        for (let i = 0; i < tarClassesArr.length; i++) {
            if (eleClassesArr.indexOf(tarClassesArr[i]) === -1) {
                allMatch = false;
                break;
            }
        }
        return allMatch;
    };

    // 为目标元素添加若干个类名
    nodePrototype.addClass = function(tarClassesStr) {
        if (typeof tarClassesStr !== 'string' || /^\s*$/.test(tarClassesStr)) {
            throw new Error('Expected non-empty STRING as target class name(s).');
        }
        let tarClassesArr = tarClassesStr.split(/\s+/);
        let eleClassesArr = this.className.split(/\s+/);
        for (let i = 0; i < tarClassesArr.length; i++) {
            if (eleClassesArr.indexOf(tarClassesArr[i]) === -1) {
                eleClassesArr.push(tarClassesArr[i]);
            }
        }
        this.className = eleClassesArr.join(' ').trim();
        return this;
    };

    // 为目标元素移除若干个类名
    nodePrototype.removeClass = function(tarClassesStr) {
        if (typeof tarClassesStr !== 'string' || /^\s*$/.test(tarClassesStr)) {
            throw new Error('Expected non-empty STRING as target class name(s).');
        }
        let tarClassesArr = tarClassesStr.split(/\s+/);
        let eleClassesStr = this.className;
        let eleClassesArr = this.className.split(/\s+/);
        for (let i = 0; i < tarClassesArr.length; i++) {
            let pos = eleClassesArr.indexOf(tarClassesArr[i]);
            if (pos !== -1) {
                eleClassesArr[pos] = '';
            }
        }
        this.className = eleClassesArr.join(' ').trim();
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

    //////////// 基本方法 ////////////

    const NUMBER_TYPE_STYLE_NAMES = ['opacity'];
    const FLOAT_TYPE_STYLE_NAMES = ['opacity'];

    let zQueryUtil = {
        onGoingAnimations: {},
    };

    /*
    判断单个节点是否符合单个选择器
    @param {node} tarNode 目标节点
    @param {string} selector "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式的［单个］查询字符串
    @return {boolean}
    */
    wd.nodeMatchesSelector = function(tarNode, selector) {
        if (!tarNode instanceof Node) {
            throw new Error('Expected NODE as target node.');
        }
        if (typeof selector !== 'string' || selector === '') {
            throw new Error('Expected non-empty STRING as selector.');
        }
        switch (true) {
            // id选择器
            case /^#([\w-]+)$/.test(selector):
                return tarNode.id === RegExp.$1;
                // 类选择器，支持多个类
            case /^\.([\w-\.]+)$/.test(selector):
                let tarClassesStr = RegExp.$1.split('.');
                let thisNodeMatches = false;
                for (let tarClass of tarClassesStr) {
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

    /*
    处理根元素参数
    @param {node|array|undefined} root 要处理的节点。不传入则以body为起点，传入第一项为节点的数组则以该项为起点
    @return {node}
    */
    let handleRootNodeParam = function(root) {
        let r;
        switch (true) {
            case root === undefined:
                r = document.body;
                break;
            case root[0] instanceof Node:
                r = root[0];
                break;
            default:
                r = root;
        }
        return r;
    };

    /*
    根据［单个］选择器字符串查询，返回目标元素下所有符合的元素
    @param {string} selector 单个查询字符串
    @param {node|array|undefined} root 要处理的节点。不传入则以body为起点，传入第一项为节点的数组则以该项为起点
    @return {array.<node>} 返回成员类型为node的数组或空数组
    */
    let singleQuery = function(selector, root) {
        if (typeof selector !== 'string' || selector === '') {
            throw new Error('Expected non-empty STRING as selector.');
        }
        let _root = handleRootNodeParam(root);
        let result = [];
        let walker = document.createTreeWalker(_root, NodeFilter.SHOW_ELEMENT, null, false);
        let currentNode = walker.nextNode();
        while (currentNode !== null) {
            if (nodeMatchesSelector(currentNode, selector)) {
                result.push(currentNode);
            }
            currentNode = walker.nextNode();
        }
        return result;
    };

    /*
    根据［组合］选择器字符串查询，返回目标元素下所有符合的元素
    @param {string} selectorGroup 多个以空格连接的查询字符串
    @param {node|array|undefined} root 要处理的节点。不传入则以body为起点，传入第一项为节点的数组则以该项为起点
    @return {array.<node>} 返回成员类型为node的数组或空数组
    */
    let multiQuery = wd.$ = function(selectorGroup, root) {
        // 选择器开头如有'body'去掉之
        selectorGroup = selectorGroup.trim().replace(/^body\s+/, '');
        let selectorArr = selectorGroup.split(/\s+/);
        let _root = handleRootNodeParam(root);
        if (_root.querySelectorAll !== undefined) {

            // querySelectorAll返回类数组对象，需转换为数组
            let fakeArr = _root.querySelectorAll(selectorGroup);
            return [].slice.call(fakeArr);

        } else {

            return selectorArr.reduce(function(i1, i2) {
                // 为普通空数组时返回之
                if (Array.isArray(i1) && i1[0] === undefined) {
                    return [];
                }
                return singleQuery(i2, i1);
            }, _root);

        }
    };

    /*
    返回添加/删除监听的方法，兼容远古浏览器
    @param {string|undefined} delegationSelector 要代理的元素选择器
    */
    let getOnFunc = function(ele, fn, delegationSelector) {
        let _fn;
        // 提供代理元素选择器则处理之
        if (typeof delegationSelector === 'string') {
            _fn = function(evtObj) {
                if (evtObj.target.is(delegationSelector)) {
                    fn.call(this, evtObj);
                }
            };
        } else {
            _fn = fn;
        }
        if (ele.addEventListener) {
            return function(evtName) {
                ele.addEventListener(evtName, _fn, false);
            };
        } else {
            return function(evtName) {
                ele.attachEvent('on' + evtName, _fn);
            };
        }
    };

    let getOffFunc = function(ele, evtName, fn) {
        if (ele.removeEventListener) {
            return function(evtName) {
                ele.removeEventListener(evtName, fn, false);
            };
        } else {
            return function(evtName) {
                ele.detachEvent('on' + evtName, fn);
            };
        }
    };

    /*
    在单一元素上添加/删除单一监听函数
    @param {node} ele 目标元素节点
    @param {string} evts 单一或多个目标事件
    @param {function} fn 监听函数
    @param {object} options 'method'为'add'或'remove'；提供'delegationSelector'时代理监听
    */
    wd.handleSingleListener = function(ele, evts, fn, options) {
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
                handleEachEvent = getOnFunc(ele, fn, options.delegationSelector);
                break;
            case 'remove':
                handleEachEvent = getOffFunc(ele, fn);
                break;
        }
        // 提供多个事件名时，分别添加该监听
        let targetEvents = evts.split(/\s/);
        for (let evt of targetEvents) {
            handleEachEvent(evt);
        }
    };

    // 基本动画（基于样式）
    // @param {node} ele 目标元素
    // @param {string} tarStyle 目标样式名
    // @param {string} tarValue 目标样式值
    // @return {number} cycleId 动画标识id
    wd.transformSingleRule = function(ele, tarStyle, tarValue) {
        let fullStyleValue = ele.css(tarStyle);
        let currentValue = parseFloat(fullStyleValue);
        if (!isFinite(currentValue)) {
            throw new Error('Expected a number-type style value.');
        }
        if (FLOAT_TYPE_STYLE_NAMES.indexOf(tarStyle) > -1) {
            currentValue *= 10000;
            tarValue *= 10000;
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
                ele.css(tarStyle, currentValue / 10000);
            } else {
                ele.css(tarStyle, currentValue + styleSuffix);
            }
        }, 20);
        zQueryUtil.onGoingAnimations[cycleId] = false;
        return cycleId;
    };
};