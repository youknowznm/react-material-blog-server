export default function handleStringPrototype(stringPrototype) {

    // 去除字符串首尾的空格
    if (stringPrototype.trim === undefined) {
        stringPrototype.trim = function() {
            return this.replace(/^\s+|\s+/g, '');
        };
    }

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

};