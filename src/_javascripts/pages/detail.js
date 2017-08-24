import $ from '../common/jquery'
import '../../_styles/pages/detail.scss'

$(function() {

    // 滚动时处理控制面板和导航栏样式
    let $articleContentNav = $('.article-nav')

    $(window).on('scroll', function() {
        let scTp = document.body.scrollTop
        $articleContentNav.css(
            'top',
            scTp < 192 ? 24 : (scTp - 192 + 24)
        )
    })

    // 取得文章内容的直接header元素，生成内容导航
    let $headers = $('.markdown-parsed').children(':header')
    let articleContentNavHTML = '<li>Contents</li>'
    Array.prototype.forEach.call($headers, function(item, index, array) {
        item.setAttribute('data-index', index)
        articleContentNavHTML += `<li data-index="${index}">${item.innerHTML}</li>`
    })
    // 点击非‘目录’的li时，页面滚动至对应的左侧header
    $articleContentNav.on('click', 'li', function() {
        let $this = $(this),
            index = $this.data('index')
        if ($this.is(':first-child')) {
            $('body').animate({'scrollTop': 192}, 'fast')
        } else {
            rhaegoUtil.scrollIntoTargetElement($headers[index])
        }
    })
    $articleContentNav.html(articleContentNavHTML)


})