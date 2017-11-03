module.exports = function() {

    /*
    控制面板
    */
    let $controlPanel = $('.control-panel')

    $controlPanel
        // 新建文章
        .on('click', '.panel-create-new', function() {
            location.pathname = '/create'
        })
        // 编辑文章
        .on('click', '.panel-edit', function() {
            if (!/editing=true/.test(location.search)) {
                location.assign(location.href + '?editing=true')
            }
        })
        // 注销登录
        .on('click', '.panel-log-out', function() {
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
        .on('click', '.panel-to-top', function() {
            $(document.documentElement).animate(
                {
                    scrollTop: 0
                },
                200,
            )
        })

    let $main = $('.jm-main')

    function positionControlPanel() {
        if ($('html').is('#mobile')) {
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