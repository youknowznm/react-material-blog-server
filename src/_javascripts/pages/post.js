import $ from '../common/jquery'
import '../../_styles/pages/post.scss'

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

    // let $posts = $('.post')
    // resizePostWraps()
    //
    // $(window).on('resize', function() {
    //     resizePostWraps()
    // })
    //
    // function resizePostWraps() {
    //     let w = $posts.eq(0).width()
    //     $posts.each(function() {
    //         $(this).height(w)
    //     })
    // }

    // $('')

})


