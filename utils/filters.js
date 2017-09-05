/**
ejs模板过滤器
*/

const ejs = require('ejs')
const marked = require('marked')

// 格式化Date对象为yyyy-mm-dd的字符串
ejs.filters.formatDate = function(date) {
    const to2digits = function(str) {
        return str.length === 2 ? str : ('0' + str)
    }
    return `${date.getFullYear()}-${to2digits(date.getMonth() + 1 + '')}-${to2digits(date.getDate() + '')}`
}

// 结合样式表，产生以'·'和'¬'装饰的span元素
ejs.filters.breakToSpans = function(str) {
    let arr = str.split(/\s+/g)
    let r = ''
    arr.forEach(function(item) {
        r += `<span class="single-word">${item}</span>`
    })
    return r
}

// 首字母大写
ejs.filters.capitalize = function(str) {
    return str.replace(/^\s*\S/, function(s) {
        return s.toUpperCase()
    })
}

// 根据路由传入的navType值取得body主题配色的字符串
ejs.filters.getThemeColor = function(navType) {
    return ['silver', 'gray', 'yellow', 'red'][navType]
}

// markdown解析
ejs.filters.parseMarkdown = function(markdownText) {
    return marked(markdownText)
}

// 转换当前时间与目标时间毫秒差值为可读字符串
ejs.filters.getDateDiff = function(targetDate) {
    var _sec = Math.floor((new Date().valueOf() - targetDate.valueOf()) / 1000)
    if (_sec < 60) {
        return (_sec + ' seconds ago')
    }
    if (_sec < 60 * 60) {
        var _min = Math.floor(_sec / 60)
        return (_min + ' minutes ago')
    }
    if (_sec < 60 * 60 * 24) {
        var _hou = Math.floor(_sec / (60 * 60))
        var restSeconds = Math.floor(_sec % (60 * 60))
        var _min = Math.floor(restSeconds / 60)
        return (_hou + ' hours ' + _min + ' minutes ago')
    }
    if (_sec < 60 * 60 * 24 * 30) {
        var _day = Math.floor(_sec / (60 * 60 * 24))
        return (_day + ' days ago')
    }
    var _mon = Math.floor(_sec / (60 * 60 * 24 * 30))
    return (_mon + ' months ago')
}