import $ from "./jquery"
import initMDHeader from './md-header'
import initMdButton from './md-button'
import initMdInput from './md-input'
import initMdTag from './md-tag'
import initMdTextarea from './md-textarea'
import showMdSnackbar from './md-snackbar'
import generateMaterialBackground from './md-background'

import globalMethods from './_globalMethods'

// 每页的公用逻辑
$(function() {

    initMDHeader()
    initMdInput()
    initMdTag()
    initMdTextarea()
    initMdButton()

    showMdSnackbar()

    // 新建按钮
    $('._create-new').click(function() {
        mdDelay(function() {
            location.pathname = '/create'
        })
    })

    // 回顶部按钮
    let $toTopBtn = $('._to-top')
    $toTopBtn.click(function() {
        $('body').animate({
            'scrollTop': 0
        }, 200)
    })

    // 推迟显示控制板
    setTimeout(function() {
        $('.fixed-panel').show()
    }, 1000)

    // 主导航按钮
    $('.md-header').on('click', '.nav-item', function(evt) {
        mdDelay(function() {
            location.pathname = '/' + evt.target.innerHTML
        })
    })

    // 生成md背景
    generateMaterialBackground('.post')

    // 滚动时处理控制面板样式
    let $main = $('.main'),
        $fixedPanel = $('.fixed-panel')

    $(window).on('scroll', function() {
        // 浮动控件top调整
        let _h = $main.height() - 80,
            scTp = document.body.scrollTop
        $fixedPanel.css(
            'top',
            (scTp + 200) > _h ? _h : scTp + 200
        )
    })

    /*
    footer逻辑
    */
    let $footer = $('body').children('footer')

    $footer.on('click', '.source', function() {
        mdDelay(function() {
            window.open('https://github.com/youknowznm/rhaego')
        })
    })

    // $('.mail.')

})