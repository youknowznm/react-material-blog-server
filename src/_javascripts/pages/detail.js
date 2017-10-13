import '../../_styles/pages/detail.scss'

$(function() {

    // 取得文章内容的直接header元素，生成内容导航
    let $headers = $('.markdown-parsed').children(':header')
    let articleContentNavHTML = '<li>Contents</li>'
    Array.prototype.forEach.call($headers, function(item, index, array) {
        item.setAttribute('data-index', index)
        articleContentNavHTML += `<li data-index="${index}">${item.innerHTML}</li>`
    })
    // 点击非‘目录’的li时，页面滚动至对应的左侧header
    $articleContentNav.on('click', 'li', function() {
        let $this = $(this),
            index = $this.data('index')
        if ($this.is(':first-child')) {
            $('body').animate({'scrollTop': 192}, 'fast')
        } else {
            rhaegoUtil.scrollIntoTargetElement($headers[index])
        }
    })
    $articleContentNav.html(articleContentNavHTML)

    let $commentInput = $('.comment-input ._input')
    let $submitBtn = $('.submit-comment')

    setInterval(function() {
        $submitBtn.toggleClass('_disabled', !/\S/.test($commentInput.val()))
    }, 50)

    $submitBtn.click(function() {
        if ($(this).is('._disabled')) {
            return
        }
        let data = JSON.stringify({
            content: $commentInput.val(),
            articleId: $('.jm-main-wrap').data('uid'),
        })
        $.ajax({
            contentType: 'application/json',
            url: '/saveComment',
            type: 'Post',
            data,
            success: function(result) {
                switch (true) {
                    case result.saveCommentSuccess:
                        // 保存成功

                        location.reload()

                        break
                    case result.unauthorized:
                        // 登录对话过期，保存失败
                        rhaegoUtil.showMdModal({
                            isDialog: false,
                            title: 'Authentication expired.',
                            content: 'Please re-login.',
                            onCancel() {
                                location.reload()
                            },
                        })
                        break
                    case result.paramValidationFailed:
                        // 标题、内容等参数校验错误
                        rhaegoUtil.showMdModal({
                            isDialog: false,
                            title: 'Parameter validation failed.',
                            content: 'Please check the content inputed.',
                        })
                        break
                    default:
                        // 其它原因导致的保存失败
                        rhaegoUtil.showMdModal({
                            isDialog: false,
                            title: 'Save article failed.',
                            content: 'An error occurred during saving. Please try agin later.'
                        })
                }
            },
        })
    })

})