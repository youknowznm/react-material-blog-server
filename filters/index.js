const ejs = require('ejs')

ejs.filters.formatTitle = function(str) {
    // let arr = str.split(/\s+/);
    // arr.map(function(item, ))
    // <span class="single-word">Laguna</span>
}

ejs.filters.breakToSpans = function(str) {
    let arr = str.split(/\s+/g)
    let r = ''
    arr.forEach(function(item) {
        r += `<span class="single-word">${item}</span>`
    })
    return r
}

ejs.filters.capitalize = function(str) {
    return str.replace(/^\s*\S/, function(s) {
        return s.toUpperCase()
    })
}
