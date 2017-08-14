import $ from '../common/jquery'
import '../../_styles/pages/postAndProductOverview.scss'
import generateMaterialBackground from '../common/md-background'

$(function() {

    // 生成md背景
    generateMaterialBackground('.post')

    $('.post-link').click('.tag', function() {
        $mdDelay(function(){
            let targetTag = (this).data('originTag')
            location.pathName = '/posts?tag=' + targetTag
        })
    })

})


