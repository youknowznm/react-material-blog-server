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
                content: 'Only logged-in users can comment articles.',
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
                    scrollTop: 192
                },
                200,
            )
        })

    $(window).on('scroll', function(e) {
        let pageScrollTop = document.documentElement.scrollTop
        $controlPanel.css('top', pageScrollTop + 200)
    })

    // 推迟显示
    setTimeout(function() {
        $controlPanel.show()
    }, 600)

}