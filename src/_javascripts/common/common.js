import $ from "./jquery"
import initMDHeader from './md-header'
import initMdButton from './md-button'
import initMdInput from './md-input'
import initMdTag from './md-tag'
import initMdTextarea from './md-textarea'
import generateMaterialBackground from './md-background'

$(function() {

    initMDHeader()
    initMdInput()
    initMdTag()
    initMdTextarea()
    initMdButton()

    // 在点击动画结束后调用函数
    function mdDelay(fn) {
        setTimeout(function() {
            fn()
        }, 400)
    }

    // 新建按钮
    $('.fixed-panel .create-new').click(function() {
        mdDelay(function() {
            location.pathname = '/create'
        })
    })

    // 回顶部按钮
    $('.fixed-panel .to-top').click(function() {
        $('body').animate({
            'scrollTop': 0
        }, 200)
    })

    // 主导航按钮
    $('.md-header').on('click', ' .nav-item:not(.active)', function(evt) {
        mdDelay(function() {
            location.pathname = '/' + evt.target.innerHTML
        })
    })

    generateMaterialBackground('.post')

})
