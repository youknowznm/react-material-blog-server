import initJqueryMaterial from './_initJqueryMaterial.js';
import initControlPanel from './_initControlPanel.js';
import initLogin from './_initLogin.js';

// 每页的公用逻辑
$(function() {

    let $html = $('html')
    let $body = $('body')

    let shoudFitToView = document.documentElement.scrollHeight > document.documentElement.clientHeight
    console.log(shoudFitToView);
    console.log(document.documentElement.scrollHeight, document.documentElement.clientHeight, document.documentElement.offsetHeight);
    // $html.toggleClass('fit-to-view', shoudFitToView)

    initJqueryMaterial()
    initLogin()
    initControlPanel()

    /*
    主导航按钮
    */
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
    $('.article-tag').bindClickListener(function($this) {
        let articleType = ($('.jm-header').data('navType').toString() === '1') ? 'product' : 'post'
        let tagName = $this.data('text')
        location.assign(`/${articleType}s?tag=${tagName}`)
    })

    if ($html.is('#mobile')) {
        $('.jm-main-wrap').css({
            minHeight: window.innerHeight - 292
        })
    }

})