import $ from '../common/jquery'
import '../../_styles/pages/postAndProductOverview.scss'
import generateMaterialBackground from '../common/md-background'

$(function() {

    // 生成md背景
    generateMaterialBackground('.post')
    generateMaterialBackground('.product')

    $('.post')
        // 点击博客的大部分区域，跳转至该博客id的路由
        .on('click', function() {
            let postId = $(this).attr('data-id')
            location.assign('/posts/' + postId)
        })
        // 点击博客的任一标签，跳转至含该标签的路由
        .on('click', '.tag', function(evt) {
            evt.stopPropagation()
            let targetTag = $(this).attr('data-origin-tag')
            rhaegoUtil.mdDelay(function(){
                location.assign('/posts?tag=' + targetTag)
            })
        })

    // TODO
    // $('.post')
    //     // 点击博客的大部分区域，跳转至该博客id的路由
    //     .on('click', function() {
    //         let postId = $(this).attr('data-id')
    //         location.assign('/posts/' + postId)
    //     })
    //     // 点击博客的任一标签，跳转至含该标签的路由
    //     .on('click', '.tag', function(evt) {
    //         evt.stopPropagation()
    //         let targetTag = $(this).attr('data-origin-tag')
    //         rhaegoUtil.mdDelay(function(){
    //             location.assign('/posts?tag=' + targetTag)
    //         })
    //     })


})


