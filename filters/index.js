const ejs = require('ejs')

ejs.filters.formatTitle = function(str) {
    // let arr = str.split(/\s+/);
    // arr.map(function(item, ))
    // <span class="single-word">Laguna</span>
}

ejs.filters.capitalize = function(str) {
    return str.replace(/^\s*\S/, function(s) {
        return s.toUpperCase()
    })
}
