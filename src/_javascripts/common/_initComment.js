module.exports = function() {

    // 方法：追加新评论元素，清空输入框，滚动至底部
    function appendNewCommentElement($container, commentHTML) {
        let $newComment = $(commentHTML)
        let newCommentIndex = $container.find('.comment-order-badge').length + 1
        $newComment.find('.comment-order-badge').text(newCommentIndex)
        $container.append($newComment)
        $('#jm-input-1').val('')
        $('.comment-input .jm-input').removeClass('non-empty')
        $('html').animate({
            scrollTop: $(document).height()
        })
    }

    // 方法：移除评论元素后执行回调
    function removeCommentElement($removeCommentButton, cb) {
        let $targetComment = $removeCommentButton.parents('.comment')
        $targetComment.fadeOut(
            function() {
                $targetComment.remove()
                cb()
            }
        )
    }

    $(function() {
        let $noComments = $('.no-comments')

        let $commentsContainer = $('.comments-list')

        let $commentJmInput = $('.comment-input .jm-input')
        let $submitCommentButton = $('.submit-comment')

        let articleId = $('[data-article-id]').data('articleId') || 'INDEPENDENT_MESSAGES'

        // 评论内容验证
        setInterval(function() {
            let commentInputValid = /\S/.test($commentJmInput.find('._input').val())
                && !$commentJmInput.hasClass('invalid')
            $submitCommentButton.toggleClass('_disabled', !commentInputValid)
        }, 50)

        // 评论发送
        $submitCommentButton.click(function() {
            let $this = $(this)
            if (!$this.is('._disabled')) {
                let dataObj = {
                    content: $commentJmInput.find('._input').val(),
                    articleId,
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
                                appendNewCommentElement($commentsContainer, result.savedCommentHTML)
                                $noComments.removeClass('show')
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

        // 确认后删除评论
        $commentsContainer.on('click', '.remove-comment', function() {
            let $this = $(this)
            let dataObj = {
                commentId: $this.data('commentId'),
                articleId,
            }
            $.showJmDialog({
                dialogType: 'confirm',
                title: 'Delete this comment?',
                content: 'Deleted comments cannot be recovered.',
                onConfirm() {
                    $.ajax({
                        contentType: 'application/json',
                        url: '/removeComment',
                        type: 'Post',
                        data: JSON.stringify(dataObj),
                        success: function(result) {
                            switch (true) {
                                case result.removeCommentSuccess:
                                    // 保存成功
                                    removeCommentElement($this, function() {
                                        $noComments.toggleClass('show', $commentsContainer.children('.comment').length === 0)
                                    })
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
                                        content: 'Please use valid parameters.',
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

    })
}