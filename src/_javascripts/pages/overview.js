import '../../_styles/pages/overview.scss'

$(function() {

    // 生成md背景
    $('.article').initBackground()

    // 稍候显示无内容提示
    let $emptyMsg = $('.empty-msg')
    if ($emptyMsg.length > 0) {
        $('html').addClass('fit-to-view')
        setTimeout(function() {
            $emptyMsg.addClass('show')
        }, 1200)
    }

    // 点击文章的大部分区域，跳转至该文章id的路由
    $('.article').on('click', function() {
        let articleId = $(this).data('id')
        location.assign('/articles/' + articleId)
    })

})