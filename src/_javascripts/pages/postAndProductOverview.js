import $ from '../common/jquery'
import '../../_styles/pages/postAndProductOverview.scss'
import generateMaterialBackground from '../common/md-background'

$(function() {

    // 生成md背景
    generateMaterialBackground('.post')
    generateMaterialBackground('.product')

    $('.')

    $('.post')
        // 点击博客的大部分区域，跳转至该博客id的路由
        .on('click', function() {
            let postId = $(this).data('id')
            location.assign('/posts/' + postId)
        })
        // 点击博客的任一标签，跳转至含该标签的所有博客
        .on('click', '.tag', function(evt) {
            evt.stopPropagation()
            let targetTag = $(this).data('originTag')
            rhaegoUtil.mdDelay(function(){
                location.assign('/posts?tag=' + targetTag)
            })
        })

    $('.product')
        // 点击产品的大部分区域，在新标签页中打开该产品的外链
        .on('click', function() {
            let productExtLink = $(this).attr('data-ext-link')
            window.open(productExtLink)
        })
        // 点击产品的任一标签，跳转至含该标签的所有产品
        .on('click', '.tag', function(evt) {
            evt.stopPropagation()
            let targetTag = $(this).attr('data-origin-tag')
            rhaegoUtil.mdDelay(function(){
                location.assign('/products?tag=' + targetTag)
            })
        })


})


