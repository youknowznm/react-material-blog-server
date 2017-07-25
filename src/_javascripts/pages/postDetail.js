import $ from '../common/jquery'
import '../../_styles/pages/postDetail.scss'

$(function() {

    // 滚动时处理控制面板和导航栏样式
    let $postContentNav = $('.post-nav')

    $(window).on('scroll', function() {
        let scTp = document.body.scrollTop
        $postContentNav.css(
            'top',
            scTp < 192 ? 24 : (scTp - 192 + 24)
        )
    })

    // 取得博客内容的直接header元素，生成内容导航
    let $headers = $('.markdown-parsed').children(':header')
    let postContentNavHTML = '<li>Contents</li>'
    Array.prototype.forEach.call($headers, function(item, index, array) {
        item.setAttribute('data-index', index)
        postContentNavHTML += `<li data-index="${index}">${item.innerHTML}</li>`
    })
    // 点击非‘目录’的li时，页面滚动至对应的左侧header
    $postContentNav.on('click', 'li', function() {
        let $this = $(this),
            index = $this.data('index')
        if ($this.is(':first-child')) {
            $('body').animate({'scrollTop': 192}, 'fast')
        } else {
            rhaegoUtil.scrollIntoTargetElement($headers[index])
        }
    })
    $postContentNav.html(postContentNavHTML)


})