module.exports = function() {

    /*
    控制面板
    */
    let isMobile = $('html').is('#mobile')

    let $body = $('body')
    let $main = $('.jm-main')

    let $controlPanel = $('.control-panel')

    let $createNew = $controlPanel.children('.panel-create-new')
    let $edit = $controlPanel.children('.panel-edit')
    let $logOut = $controlPanel.children('.panel-log-out')
    let $toTop = $controlPanel.children('.panel-to-top')

    // 新建文章
    $createNew.bindClickListener(function() {
        location.pathname = '/create'
    })
    // 编辑文章
    $edit.bindClickListener(function() {
        if (!/editing=true/.test(location.search)) {
            location.assign(location.href + '?editing=true')
        }
    })
    // 注销登录
    $logOut.bindClickListener(function() {
        $.showJmDialog({
            dialogType: 'confirm',
            title: 'Log out?',
            content: 'Only logged-in users can comment articles or leave a message.',
            onConfirm() {
                $.ajax({
                    url: '/logout',
                    type: 'Get',
                    data: '',
                    success() {
                        localStorage.removeItem('userInfoToasted')
                        location.reload()
                    }
                })
            }
        })
    })
    // 回顶部
    $toTop.bindClickListener(function() {
        $body.jmScrollInto()
    })


    // 移动端使用小按钮样式
    if (isMobile) {
        $controlPanel.find('.jm-button').addClass('_small')
    }

    function positionControlPanel() {
        if (isMobile) {
            $controlPanel.css({
                left: 'auto',
                right: 12,
            })
        } else {
            $controlPanel.css({
                left: $main.width() + parseInt($main.css('marginLeft')) + 18
            })
        }
    }

    positionControlPanel()

    $(window).on('resize', function(e) {
        positionControlPanel()
    })

    // 推迟显示
    setTimeout(function() {
        $controlPanel.show()
    }, 600)

}