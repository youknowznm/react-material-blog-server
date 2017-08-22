/**
ejs模板过滤器
*/

const ejs = require('ejs')
const marked = require('marked')

// 结合样式表，产生以'·'和'¬'装饰的span元素
ejs.filters.breakToSpans = function(str) {
    let arr = str.split(/\s+/g)
    let r = ''
    arr.forEach(function(item) {
        r += `<span class="single-word">${item}</span>`
    })
    return r
}

// 大写
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
