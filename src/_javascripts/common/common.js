let siteNameWords = ['You', 'Know', 'znM']

// 每页的公用逻辑
$(function() {

    $('.jm-header').initHeader({
        siteNameWords,
        navContents: ['posts', 'products', 'messages', 'about'],
    })

    $('.jm-footer').initFooter({
        siteInfo: {
            siteNameWords,
            siteAuthorName: 'youknowznm',
            siteAuthorHomepage: 'https://github.com/youknowznm',
            siteSourceLink: 'https://github.com/youknowznm/jqueryMaterial.js',
        },
        socialInfo: {
            wechatQrLink: '/_images/footer/wechat-qr.png',
            email: 'znm92@icloud.com',
            zhihuLink: 'https://www.zhihu.com/people/youkonwznm',
            githubLink: 'https://github.com/youknowznm',
        },
    })

    $('.jm-button').initButton()

    /*
    控制面板
    */
    let $main = $('.jm-main')
    let $controlPanel = $('.control-panel')
    $controlPanel
        // left值初始化
        // .css('left',  $main.width() + $main.offset().left - 75)
        // 新建文章
        .on('click', '._create-new', function() {
            rhaegoUtil.mdDelay(function() {
                location.pathname = '/create'
            })
        })
        // 编辑文章
        .on('click', '._edit', function() {
            rhaegoUtil.mdDelay(function() {
                location.assign(location.href + '?editing=true')
            })
        })
        // 注销登录
        .on('click', '._logout', function() {
            rhaegoUtil.showMdModal({
                isDialog: true,
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
    // // 位置随窗口响应变化
    // $(window).on('resize', function() {
    //     $controlPanel.css('left',  $main.width() + $main.offset().left - 75)
    // })
    // 推迟显示
    setTimeout(function() {
        $controlPanel.show()
    }, 600)

    /*
    主导航按钮
    */
    $('.md-header').on('click', '.nav-item', function() {
        let targetPath = $(this).data('href')
        // 不同url的切换产生动画
        if (location.pathname !== targetPath) {
            setTimeout(function() {
                if (location.pathname !== targetPath) {
                    location.assign(targetPath)
                }
            }, 800)
        // 相同url下的切换直接跳转
        } else {
            location.assign(targetPath)
        }
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