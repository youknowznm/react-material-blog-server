// let siteNameWords = ['You', 'Know', 'znM']
let siteNameWords = ['Rh', 'ae', 'go']

module.exports = function() {

    let $jmHeader = $('.jm-header')
    console.log($jmHeader.data('navType').valueOf());
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
            wechatQrLink: '/_images/footer/wechat-qr.png',
            email: 'znm92@icloud.com',
            zhihuLink: 'https://www.zhihu.com/people/youkonwznm',
            githubLink: 'https://github.com/youknowznm',
        },
    })

    $('.jm-button').initButton()
    $('.jm-input').initInput()

}

