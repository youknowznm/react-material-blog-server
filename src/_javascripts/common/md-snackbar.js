import $ from './jquery'
import initMdButton from './md-button'
import initMdInput from './md-input'

/**
@param
*/
export default function showMdSnackbar() {

    let $mdSnackbar = $('.md-snackbar')

    //
    $('body').on('click', function(e) {
        let $this = $(e.target)
        $mdSnackbar.toggleClass('show-full', $this.closest('.md-snackbar').length !== 0)
    })

    setTimeout(function() {
        $('.md-snackbar').addClass('show-partial')
    }, 10)


    // 登录注册的元素显隐切换
    $mdSnackbar
        .on('click', '._to-register', function() {
            $mdSnackbar.children('._content').fadeIn().removeClass('show')
                .filter('._register').addClass('show')
        })
        .on('click', '._to-login', function() {
            $mdSnackbar.children('._content').fadeIn().removeClass('show')
                .filter('._login').addClass('show')
        })
        .on('click', '.send-mail', function() {
            $mdSnackbar.children('._content').fadeIn().removeClass('show')
                .filter('._notification').addClass('show')
        })


}