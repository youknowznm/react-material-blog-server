import initJqueryMaterial from './_initJqueryMaterial.js';
import initControlPanel from './_initControlPanel.js';
import initLoginAndRegister from './_initLoginAndRegister.js';


// 每页的公用逻辑
$(function() {

    initJqueryMaterial()
    initControlPanel()
    initLoginAndRegister()

    /*
    主导航按钮
    */
    $('.jm-header').on('click', '.nav-item', function() {
        let targetPath = $(this).data('href')
        // 不同url的切换产生动画
        if (location.pathname !== targetPath) {
            setTimeout(function() {
                if (location.pathname !== targetPath) {
                    location.assign(targetPath)
                }
            }, 800)
        // 相同url下的切换直接跳转
        } else {
            location.assign(targetPath)
        }
    })

})