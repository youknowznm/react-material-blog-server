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
                for (let ele of $registerInputs) {
                    let $this = $(ele)
                    let val = $this.find('._input').val()
                    $this.toggleClass('invalid', /^\s*$/.test(val))
                }
            })
        })
        .on('click', '.login', function() {
            rhaegoUtil.mdDelay(function() {
                for (let ele of $loginInputs) {
                    let $this = $(ele)
                    let val = $this.find('._input').val()
                    $this.toggleClass('invalid', /^\s*$/.test(val))
                }
            })
        })
        // 输入时的判断
        .on('input', '._input', function() {
            let $this = $(this)
            $this.closest('.md-input').toggleClass('invalid', /^\s*$/.test($this.val()))
        })


}