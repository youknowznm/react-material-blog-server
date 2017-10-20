import '../../_styles/pages/detail.scss'
import initComment from '../common/_initComment.js';

initComment()

$(function() {

    let $commentInputWrap = $('.comment-input')

    $('.no-comments > p').text('Be the first one to leave a message.')

    if ($commentInputWrap.data('hasLoggedIn') === true) {
        let $commentInput = $commentInputWrap.children('.jm-input')
        let newLabel = $commentInput.data('label').replace('Comment', 'Leave a message')
        $commentInput.find('.placeholder').text(newLabel)
    }

})