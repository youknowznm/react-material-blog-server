import '../../_styles/pages/detail.scss'

// 结合样式表，产生以'·'和'¬'装饰的span元素
function breakToSpans(str) {
    let arr = str.split(/\s+/g)
    let r = ''
    arr.forEach(function(item) {
        r += `<span class="jm-single-word">${item}</span>`
    })
    return r
}

// 追加新评论dom，清空输入框
function appendNewCommentDOM($container, commentHTML) {
    let $newMessage = $(commentHTML)
    let newCommentIndex = $container.find('.comment-order-badge').length + 1
    $newMessage.find('.comment-order-badge').text(newCommentIndex)
    $container.append($newMessage)
    $newMessage.jmScrollInto()
    $('#jm-input-1').val('')
    $('.comment-input .jm-input').removeClass('non-empty')
}

$(function() {

    let $body = $('body')
    let $article = $('.jm-article')
    let $commentsContainer = $('.comments-list')

    let $articleContentNav = $('.article-content-nav')

    let $pageTitle = $('.page-title')
    $pageTitle.html(breakToSpans($article.data('pageTitle')))

    // 取得文章内容的直接header元素，生成内容导航
    let $headers = $article.children(':header')
    let articleContentNavHTML = '<li>Contents</li>'
    Array.prototype.forEach.call($headers, function(item, index, array) {
        item.setAttribute('data-jm-heading-index', index)
        articleContentNavHTML += `<li data-jm-heading-index="${index}">${$(item).text()}</li>`
    })
    // 点击非‘目录’的li时，页面滚动至对应的左侧header
    $articleContentNav.on('click', 'li', function() {
        let $this = $(this)
        let index = $this.data('jmHeadingIndex')
        let targetScrollTop
        if ($this.is(':first-child')) {
            targetScrollTop = 192
        } else {
            targetScrollTop = $headers.eq(index).offset().top - 88
        }
        $(document.documentElement).animate(
            {
                scrollTop: targetScrollTop
            },
            'fast',
        )
    })
    $articleContentNav.html(articleContentNavHTML)

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
                            appendNewCommentDOM($commentsContainer, result.savedCommentHTML)
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

    let $jmActualHeadings = $article.find('[data-jm-heading-index]')
    let $jmNavHeadings = $articleContentNav.find('[data-jm-heading-index]')

    // 滚动时
    $(window).on('scroll', function() {
        let pageScrollTop = document.documentElement.scrollTop
        // 内容导航吸顶
        if (pageScrollTop > 192) {
            $articleContentNav.css('top', pageScrollTop - 168)
        } else {
            $articleContentNav.css('top', 24)
        }
        // 改变右侧导航的高亮标题
        let currentHeadingIndex = 0
        for (let i = $jmActualHeadings.length - 1; i > -1; --i) {
            let $this = $jmActualHeadings.eq(i)
            if ($this.offset().top - 90 < pageScrollTop) {
                currentHeadingIndex = $this.data('jmHeadingIndex')
                $jmNavHeadings.removeClass('current').eq(currentHeadingIndex).addClass('current')
                return false
            } else {
                $jmNavHeadings.removeClass('current')
            }
        }
    })

})