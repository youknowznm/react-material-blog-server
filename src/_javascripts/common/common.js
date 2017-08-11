import $ from "./jquery"
import initMDHeader from './md-header'
import initMdButton from './md-button'
import initMdInput from './md-input'
import initMdTag from './md-tag'
import initMdTextarea from './md-textarea'
import showMdSnackbar from './md-snackbar'

import globalMethods from './_initializeGlobalMethods'

// 每页的公用逻辑
$(function() {

    initMDHeader()
    initMdInput()
    initMdTag()
    initMdTextarea()
    initMdButton()
    showMdSnackbar()

    /*
    控制面板
    */

    let $main = $('.main')
    let $controllPanel = $('.controll-panel')

    $controllPanel
        // left值初始化
        .css('left',  $main.width() + $main.offset().left - 75)
        // 新建文章
        .on('click', '._create-new', function() {
            rhaegoUtil.mdDelay(function() {
                location.pathname = '/create'
            })
        })
        // 注销登录
        .on('click', '._logout', function() {
            rhaegoUtil.showMdDialog({
                title: 'Log out?',
                content: 'Only logged-in users are able to comment or like posts.',
                onConfirm() {
                    $.ajax({
                        url: '/logout',
                        type: 'Get',
                        data: '',
                        success() {
                            location.reload()
                        }
                    })
                }
            })
        })

    // 位置随窗口响应变化
    $(window).on('resize', function() {
        $controllPanel.css('left',  $main.width() + $main.offset().left - 75)
    })

    // 推迟显示
    setTimeout(function() {
        $controllPanel.show()
    }, 600)

    /*
    主导航按钮
    */
    $('.md-header').on('click', '.nav-item', function(evt) {
        let targetPath = '/' + evt.target.innerHTML
        setTimeout(function() {
            if (location.pathname !== targetPath) {
                location.pathname = targetPath
            }
        }, 800)
    })

    /*
    footer的view source按钮
    */
    $('footer').on('click', '.source', function() {
        rhaegoUtil.mdDelay(function() {
            window.open('https://github.com/youknowznm/rhaego')
        })
    })

})