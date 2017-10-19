module.exports = function() {

    // 追加新评论dom，清空输入框
    function appendNewCommentDOM($container, commentHTML) {
        let $newComment = $(commentHTML)
        let newCommentIndex = $container.find('.comment-order-badge').length + 1
        $newComment.find('.comment-order-badge').text(newCommentIndex)
        $container.append($newComment)
        $newComment.jmScrollInto()
        $('#jm-input-1').val('')
        $('.comment-input .jm-input').removeClass('non-empty')
    }

    //
    function removeCommentDOM($removeCommentButton) {
        let $targetComment = $removeCommentButton.parents('.comment')
        $targetComment.slideUp(
            'fast',
            function() {
                $targetComment.remove()
            }
        )
    }


    $(function() {
        let $commentsContainer = $('.comments-list')

        let $commentJmInput = $('.comment-input .jm-input')
        let $submitCommentButton = $('.submit-comment')

        let articleId = $('[data-article-id]').data('articleId')

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

        //
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
                                    removeCommentDOM($this)
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