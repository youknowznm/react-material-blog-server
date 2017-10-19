import '../../_styles/pages/detail.scss'
import initComment from '../common/_initComment.js';

initComment()

// 结合样式表，产生以'·'和'¬'装饰的span元素
function breakToSpans(str) {
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

    $('.page-title').html(breakToSpans($article.data('pageTitle')))

    // 取得文章内容的直接header元素，生成内容导航
    let $headers = $article.children(':header')
    let articleContentNavHTML = '<li>Contents</li>'
    Array.prototype.forEach.call($headers, function(item, index, array) {
        item.setAttribute('data-jm-heading-index', index)
        articleContentNavHTML += `<li data-jm-heading-index="${index}">${$(item).text()}</li>`
    })
    // 点击非‘目录’的li时，页面滚动至对应的左侧header
    $articleContentNav.on('click', 'li', function() {
        let $this = $(this)
        if (!$this.hasClass('current')) {
            let index = $this.data('jmHeadingIndex')
            let targetScrollTop
            if ($this.is(':first-child')) {
                targetScrollTop = 192
            } else {
                targetScrollTop = $headers.eq(index).offset().top - 88
            }
            $articleContentNav.hide()
            $(document.documentElement).animate(
                {
                    scrollTop: targetScrollTop
                },
                'fast',
                function() {
                    $articleContentNav.fadeIn('fast')
                }
            )
        }
    })
    $articleContentNav.html(articleContentNavHTML)

    let $jmActualHeadings = $article.find('[data-jm-heading-index]')
    let $jmNavHeadings = $articleContentNav.find('[data-jm-heading-index]')

    // 滚动时
    $(window).on('scroll', function() {
        let pageScrollTop = document.documentElement.scrollTop
        // 内容导航吸顶
        if (pageScrollTop > 192) {
            $articleContentNav.css('top', pageScrollTop - 168)
        } else {
            $articleContentNav.css('top', 24)
        }
        // 改变右侧导航的高亮标题
        let currentHeadingIndex = 0
        for (let i = $jmActualHeadings.length - 1; i > -1; --i) {
            let $this = $jmActualHeadings.eq(i)
            if ($this.offset().top - 90 < pageScrollTop) {
                currentHeadingIndex = $this.data('jmHeadingIndex')
                $jmNavHeadings.removeClass('current').eq(currentHeadingIndex).addClass('current')
                return false
            } else {
                $jmNavHeadings.removeClass('current')
            }
        }
    })

})