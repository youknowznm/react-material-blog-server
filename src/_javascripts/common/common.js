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


    // 新建文章
    $('._create-new').click(function() {
        rhaegoUtil.mdDelay(function() {
            location.pathname = '/create'
        })
    })

    // 注销登录
    $('._logout').click(function() {
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

    // 推迟显示控制板
    setTimeout(function() {
        $('.controll-panel').show()
    }, 1000)

    // 主导航按钮
    $('.md-header').on('click', '.nav-item', function(evt) {
        let targetPath = '/' + evt.target.innerHTML
        rhaegoUtil.mdDelay(function() {
            if (location.pathname !== targetPath) {
                location.pathname = targetPath
            }
        })
    })

    // 生成md背景
    generateMaterialBackground('.post')

    // 滚动时处理控制面板样式
    let $main = $('.main'),
        $controllPanel = $('.controll-panel')

    /*
    footer逻辑
    */
    $('footer').on('click', '.source', function() {
        rhaegoUtil.mdDelay(function() {
            window.open('https://github.com/youknowznm/rhaego')
        })
    })

    // 控制面板位置响应
    $('.controll-panel').css('left',  $main.width() + $main.offset().left - 75)
    $(window).on('resize', function() {
        $('.controll-panel').css('left',  $main.width() + $main.offset().left - 75)
    })


})