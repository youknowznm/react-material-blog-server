export default function addUtil(wd) {

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

}