import '../../_styles/pages/detail.scss'
import initComment from '../common/_initComment.js';
import initArticleNav from '../common/_initArticleNav.js';

initComment()

// 结合样式表，产生以'·'和'¬'装饰的span元素
function breakToSpans(str) {
    str = str + ''
    let arr = str.split(/\s+/g)
    let r = ''
    arr.forEach(function(item) {
        r += `<span class="jm-single-word">${item}</span>`
    })
    return r
}

$(function() {

    let $body = $('body')
    let $article = $('.jm-article')

    let $articleContentNav = $('.article-content-nav')

    initArticleNav($article, $articleContentNav)

    $('.page-title').html(breakToSpans($article.data('pageTitle')))

    let $headers = $article.find(':header')
    if ($headers.length > 0) {
        $headers.each(function() {
            let $this = $(this)
            $this.html(breakToSpans($this.html()))
        })
    }

})