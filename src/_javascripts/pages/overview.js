import $ from '../common/jquery'
import '../../_styles/pages/overview.scss'
import generateMaterialBackground from '../common/md-background'

$(function() {

    // 生成md背景
    generateMaterialBackground('.article')

    // 稍候显示无内容提示
    let $emptyMsg = $('.empty-msg')
    setTimeout(function() {
        $emptyMsg.toggleClass('show', $emptyMsg.length > 0)
    }, 1200)

    $('.article')
        // 点击博客的大部分区域，跳转至该博客id的路由
        .on('click', function() {
            let postId = $(this).data('id')
            location.assign('/articles/' + postId)
        })
        // 点击博客的任一标签，跳转至含该标签的所有博客
        .on('click', '.tag', function(evt) {
            evt.stopPropagation()
            let targetTag = $(this).data('originTag')
            rhaegoUtil.mdDelay(function(){
                location.assign('/articles?tag=' + targetTag)
            })
        })

})


