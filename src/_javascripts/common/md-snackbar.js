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
    let $registerInputEmail = $registerInputs.filter('.email')
    let $registerInputNickname = $registerInputs.filter('.nickname')
    let $registerInputPassword = $registerInputs.filter('.password')
    let $registerInputConfirmPassword = $registerInputs.filter('.confirm-password')

    let emailRegExp = /^([a-zA-Z\d]+)\w@(\w+)(\.[a-zA-Z]{1,4}){1,2}$/

    //
    $('body').on('click', function(e) {
        let $this = $(e.target)
        $mdSnackbar.toggleClass('show-full', $this.closest('.md-snackbar').length !== 0)
    })

    setTimeout(function() {
        $('.md-snackbar').addClass('show-full')
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
        // 登录的客户端逻辑
        .on('click', '.login', function() {
            // 先去掉invalid类再给予，闪烁一下
            $loginInputs.removeClass('invalid')
            setTimeout(function() {
                for (let ele of $loginInputs) {
                    let $this = $(ele)
                    let val = $this.find('._input').val()
                    if ($this.is('.email')) {
                        $this.toggleClass('invalid', !emailRegExp.test(val))
                    } else {
                        $this.toggleClass('invalid', /^\s*$/.test(val))
                    }
                }

            }, 400)
        })
        // 注册的客户端逻辑
        .on('click', '.register', function() {
            // 先去掉invalid类再给予，闪烁一下
            $registerInputs.removeClass('invalid')
            setTimeout(function() {
                for (let ele of $registerInputs) {
                    let $this = $(ele)
                    let val = $this.find('._input').val()
                    if ($this.is('.email')) {
                        // 邮件
                        $this.toggleClass('invalid', !emailRegExp.test(val))
                    } else {
                        // 普通
                        $this.toggleClass('invalid', /^\s*$/.test(val))
                    }
                }
                let pwd1 = $registerInputPassword.children('._input').val()
                let pwd2 = $registerInputConfirmPassword.children('._input').val()
                // 两个密码框均为非空时，进行一致性判断。
                if (pwd1 !== '' && pwd2 !== '') {
                    if (pwd1 !== pwd2) {
                        $registerInputConfirmPassword.find('.error').text('Password typo.')
                            .end().addClass('invalid')
                    } else {
                        $registerInputConfirmPassword.find('.error').text('Required.')
                            .end().removeClass('invalid')
                    }
                }
                if ($registerInputs.filter('.invalid').length === 0) {
                    let data = {
                        email: $registerInputEmail.children('._input').val(),
                        nickname: $registerInputNickname.children('._input').val().trim(),
                        password: $registerInputConfirmPassword.children('._input').val(),
                    }
                    console.log(data);
                    $.ajax({
                        // contentType: 'application/json',
                        url: '/register',
                        type: 'Post',
                        data,
                        success: function(data) {
                            console.log('s', data)
                        },
                        fail: function(data) {
                            console.log('f', data)
                        },
                    })
                }
            }, 400)
        })
        // 输入时的判断
        .on('input', '._input', function() {
            let $this = $(this)
            let $p = $this.closest('.md-input')
            $p.toggleClass('invalid', /^\s*$/.test($this.val()))
        })


}