import $ from '../common/jquery'
import showMdDialog from './md-dialog'


/*
* 定义全局方法
*/

//
window.showMdDialog = showMdDialog

// 在点击动画结束后调用函数
window.mdDelay = function(fn) {
    setTimeout(function() {
        fn()
    }, 400)
}

/*
动画滚动页面至目标元素位置
@param ele {Node} 目标元素
@param cb {function?} 滚动完成的回调
*/
window.scrollIntoTargetElement = function(ele, cb) {
    let bodyPaddingTop = parseInt($('body').css('padding-top'))
    let targetEleScrollTop = ele.offsetTop
    let targetBodyScrollTop = targetEleScrollTop - bodyPaddingTop + 175
    let tId = setInterval(function() {
        let currentBodyScrollTop = document.body.scrollTop
        let diff = targetBodyScrollTop - currentBodyScrollTop
        switch (true) {
            case diff > 0:
                currentBodyScrollTop += Math.ceil(diff / 5)
                break
            case diff < 0:
                currentBodyScrollTop -= Math.ceil(diff / -5)
                break
            default:
                clearIntervalAndCallback(tId, cb)
        }
        document.body.scrollTop = currentBodyScrollTop
        // 如果页面滚动到了底部，也停止interval
        if (document.body.scrollHeight - document.body.scrollTop === document.body.clientHeight) {
            clearIntervalAndCallback(tId, cb)
        }
    }, 10)
    function clearIntervalAndCallback(n, f) {
        clearInterval(n)
        if (typeof f === 'function') {
            f()
        }
    }
}

export default 'globalMethods'