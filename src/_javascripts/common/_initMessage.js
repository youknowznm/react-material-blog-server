
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

$(function() {
    let $commentsContainer = $('.comments-list')

    let $commentJmInput = $('.comment-input .jm-input')
    let $submitBtn = $('.submit-comment')
    // 评论内容验证
    setInterval(function() {
        let commentInputValid = /\S/.test($commentJmInput.find('._input').val())
            && !$commentJmInput.hasClass('invalid')
        $submitBtn.toggleClass('_disabled', !commentInputValid)
    }, 50)
})