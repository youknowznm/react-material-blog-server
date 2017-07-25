import $ from './jquery'
import initMdButton from './md-button'
import initMdInput from './md-input'

/**
@param
*/
export default function showMdSnackbar() {

    let $mdSnackbar = $('.md-snackbar')
    let $contents = $mdSnackbar.children('._content')
    let $loginInputs = $contents.filter('._login').children('.md-input')
    let $registerInputs = $contents.filter('._register').children('.md-input')

    //
    $('body').on('click', function(e) {
        let $this = $(e.target)
        $mdSnackbar.toggleClass('show-full', $this.closest('.md-snackbar').length !== 0)
    })

    setTimeout(function() {
        $('.md-snackbar').addClass('show-partial')
    }, 10)


    $mdSnackbar
        // 登录注册的元素显隐切换
        .on('click', '._to-register', function() {
            $contents.removeClass('show').filter('._register').addClass('show')
        })
        .on('click', '._to-login', function() {
            $contents.removeClass('show').filter('._login').addClass('show')
        })
        .on('click', '.send-mail', function() {
            $contents.removeClass('show').filter('._notification').addClass('show')
        })
        // 登录注册的客户端逻辑
        .on('click', '.register', function() {
            rhaegoUtil.mdDelay(function() {
                let allValid = true;
                $registerInputs.each(function() {
                    $(this)
                })
            })
        })

}