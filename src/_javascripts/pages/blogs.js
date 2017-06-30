import $ from '../common/jquery'
import initGDHeader from '../common/gds-header'
import initMdButton from '../common/md-button'

import '../../_styles/pages/blogs.scss'

$(function() {

    initGDHeader()
    initMdButton()

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

})


