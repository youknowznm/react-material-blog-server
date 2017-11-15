let siteNameWords = ['You', 'Know', 'znM']

module.exports = function() {

    let $html = $('html')

    let $jmHeader = $('.jm-header')
    $jmHeader.initHeader({
        siteNameWords,
        navContents: ['posts', 'products', 'messages', 'about'],
        activeNavIndex: $jmHeader.data('navType').valueOf(),
    })

    $('.jm-footer').initFooter({
        siteInfo: {
            siteNameWords,
            siteAuthorName: 'youknowznm',
            siteAuthorHomepage: 'https://github.com/youknowznm',
            siteSourceLink: 'https://github.com/youknowznm/jqueryMaterial.js',
        },
        socialInfo: {
            wechatQrLink: 'https://raw.githubusercontent.com/youknowznm/youknowznm.github.io/master/_site/demos/jquery-material/images/footer/wechat-qr.png',
            email: 'znm92@icloud.com',
            zhihuLink: 'https://www.zhihu.com/people/youkonwznm',
            githubLink: 'https://github.com/youknowznm',
        },
    })

    $('.jm-button').initButton()
    $('.jm-input').initInput()

    // 垂直上无溢出内容时，使header .main 和 footer占满垂直空间
    let $footerBottom = $('._bottom-wrap')
    let rect = $footerBottom[0].getBoundingClientRect()
    let verticalOverflown = (rect.top + rect.height) > $html[0].clientHeight
    $html.toggleClass('fit-to-view', !verticalOverflown);

}

