import '../../_styles/pages/detail.scss'

$(function() {

    let $article = $('.jm-article')

    let $articleContentNav = $('.article-content-nav')

    // 取得文章内容的直接header元素，生成内容导航
    let $headers = $article.children(':header')
    let articleContentNavHTML = '<li>Contents</li>'
    Array.prototype.forEach.call($headers, function(item, index, array) {
        item.setAttribute('data-index', index)
        articleContentNavHTML += `<li data-index="${index}">${item.innerHTML}</li>`
    })
    // 点击非‘目录’的li时，页面滚动至对应的左侧header
    $articleContentNav.on('click', 'li', function() {
        let $this = $(this)
        let index = $this.data('index')
        if ($this.is(':first-child')) {
            $(document.documentElement).animate(
                {
                    scrollTop: 192
                },
                200,
            )
        } else {
            $headers.eq(index).jmScrollInto()
        }
    })
    $articleContentNav.html(articleContentNavHTML)
    // 滚动时内容导航吸顶
    $(window).on('scroll', function() {
        let pageScrollTop = document.documentElement.scrollTop
        if (pageScrollTop > 192) {
            $articleContentNav.css('top', pageScrollTop - 168)
        } else {
            $articleContentNav.css('top', 24)
        }
    })

    let $commentJmInput = $('.comment-input .jm-input')
    let $submitBtn = $('.submit-comment')
    // 评论内容验证
    setInterval(function() {
        let commentInputValid = /\S/.test($commentJmInput.find('._input').val())
            && !$commentJmInput.hasClass('invalid')
        $submitBtn.toggleClass('_disabled', !commentInputValid)
    }, 50)
    // 评论发送
    $submitBtn.click(function() {
        let $this = $(this)
        if (!$this.is('._disabled')) {
            let dataObj = {
                content: $commentJmInput.find('._input').val(),
                articleId: $article.data('articleId'),
            }
            $.ajax({
                contentType: 'application/json',
                url: '/saveComment',
                type: 'Post',
                data: JSON.stringify(dataObj),
                success: function(result) {
                    switch (true) {
                        case result.saveCommentSuccess:
                            // 保存成功
                            location.reload()
                            break
                        case result.unauthorized:
                            // 登录对话过期，保存失败
                            $.showJmDialog({
                                dialogType: 'alert',
                                title: 'Authentication expired.',
                                content: 'Please re-login.',
                                onConfirm() {
                                    location.reload()
                                }
                            })
                            break
                        case result.paramValidationFailed:
                            // 文章id、内容等参数校验错误
                            $.showJmDialog({
                                dialogType: 'alert',
                                title: 'Parameter validation failed.',
                                content: 'Please check all input elements.',
                            })
                            break
                        default:
                            // 其它原因导致的保存失败
                            $.showJmDialog({
                                dialogType: 'alert',
                                title: 'Save article failed.',
                                content: 'An error occurred during saving. Please try agin later.'
                            })
                    }
                },
            })
        }
    })
})