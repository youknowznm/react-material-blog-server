import initJqueryMaterial from './_initJqueryMaterial.js';
import initControlPanel from './_initControlPanel.js';
import initLogin from './_initLogin.js';

// 每页的公用逻辑
$(function() {

    initJqueryMaterial()
    initLogin()
    initControlPanel()

    /*
    主导航按钮
    */
    let $body = $('body')
    let targetPath = ''

    $body
        .on('mousedown', '.nav-button', function() {
            targetPath = `/${$(this).text()}`
        })
        .on('mouseup', function() {
            if (targetPath !== '') {
                if (location.pathname !== targetPath) {
                    // 不同url的切换产生动画
                    setTimeout(function() {
                        location.assign(targetPath)
                        targetPath = ''
                    }, 400)
                } else {
                    // 相同url下的切换直接跳转
                    location.assign(targetPath)
                }
            }
        })

    // 点击文章类型标签的跳转
    $('.article-tag').click(function(evt) {
        evt.stopPropagation()
        let articleType = ($('.jm-header').data('navType').toString() === '1') ? 'product' : 'post'
        let tagName = $(this).data('text')
        location.assign(`/${articleType}s?tag=${tagName}`)
    })

    if ($body.is('#mobile')) {
        $('.jm-main-wrap').css({
            height: window.innerHeight - 248
        })
    }

})