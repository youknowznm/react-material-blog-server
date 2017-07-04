import $ from "./jquery"
import initMDHeader from './md-header'
import initMdButton from './md-button'
import initMdInput from './md-input'
import initMdTag from './md-tag'
import initMdTextarea from './md-textarea'

$(function() {

    initMDHeader()
    initMdInput()
    initMdTag()
    initMdTextarea()
    initMdButton()

    // 对包含点击动画的按钮点击时，在点击结束后触发指定的事件监听
    $.fn.extend({
        mdDelayedClick: function(clickHandler) {
            return this.each(() => {
                this.on('click', function(evt) {
                    setTimeout(function() {
                        clickHandler(evt)
                    }, 400)
                })
            })
        }
    })

    $('.fixed-panel .create-new').mdDelayedClick(function() {
        location.pathname = '/create'
    })

    $('.fixed-panel .to-top').mdDelayedClick(function() {
        $('body').animate({
            'scrollTop': 0
        }, 200)
    })

})
