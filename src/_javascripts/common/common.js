import $ from "./jquery"
import initMDHeader from './md-header'
import initMdButton from './md-button'
import initMdInput from './md-input'
import initMdTag from './md-tag'
import initMdTextarea from './md-textarea'
import showMdDialog from './md-dialog'
import generateMaterialBackground from './md-background'

$(function() {

    initMDHeader()
    initMdInput()
    initMdTag()
    initMdTextarea()
    initMdButton()
    
    window.showMdDialog = showMdDialog

    // 在点击动画结束后调用函数
    function mdDelay(fn) {
        setTimeout(function() {
            fn()
        }, 400)
    }

    window.mdDelay = mdDelay

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

    // 过后显示控制板
    setTimeout(function() {
        $('.fixed-panel').show()
    }, 1000)

    // 主导航按钮
    $('.md-header').on('click', ' .nav-item:not(.active)', function(evt) {
        mdDelay(function() {
            location.pathname = '/' + evt.target.innerHTML
        })
    })

    // 生成md背景
    generateMaterialBackground('.post')

})
