module.exports = function($article, $articleContentNav) {

    // 取得文章内容的直接header元素，生成内容导航
    let $headers = $article.find(':header')
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
}