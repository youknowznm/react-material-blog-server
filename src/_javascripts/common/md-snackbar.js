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

    // snackbar整体的显隐切换
    $('body').on('click', function(e) {
        let $this = $(e.target)
        $mdSnackbar.toggleClass('show-full', $this.closest('.md-snackbar').length !== 0)
    })

    setTimeout(function() {
        $('.md-snackbar').addClass('show-partial')
    }, 10)

    // 根据不同输入框，以不同的正则判断内容的有效性，切换invalid类
    function validateMdInput($mdInput) {
        let emailRegExp = /^([a-zA-Z\d]+)\w@(\w+)(\.[a-zA-Z]{1,4}){1,2}$/
        let passwordRegExp = /^.{6,}$/
        let val = $mdInput.find('._input').val()
        switch (true) {
            case $mdInput.is('.email'):
                // 邮件
                $mdInput.toggleClass('invalid', !emailRegExp.test(val))
                break;
            case $mdInput.is('.password') || $mdInput.is('.confirm-password'):
                // 密码
                $mdInput.toggleClass('invalid', !passwordRegExp.test(val))
                break;
            default:
                // 普通
                $mdInput.toggleClass('invalid', /^\s*$/.test(val))
        }
    }

    $mdSnackbar
        // 登录注册的元素显隐切换
        .on('click', '._to-register', function() {
            $contents.removeClass('show').filter('._register').addClass('show')
        })
        .on('click', '._to-login', function() {
            $contents.removeClass('show').filter('._login').addClass('show')
        })
        // 登录的客户端逻辑
        .on('click', '.login', function() {
            // 先去掉invalid类再给予，闪烁一下
            $loginInputs.removeClass('invalid')
            setTimeout(function() {
                for (let ele of $loginInputs) {
                    validateMdInput($(ele))
                }
            }, 400)
        })
        // 注册的客户端逻辑
        .on('click', '.register', function() {
            // 先去掉invalid类再给予，闪烁一下
            $registerInputs.removeClass('invalid')
            setTimeout(function() {
                for (let ele of $registerInputs) {
                    validateMdInput($(ele))
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
                    $.ajax({
                        url: '/register',
                        type: 'Post',
                        data,
                        success: function(data) {
                            if (JSON.parse(data).registerSuccessful === true) {
                                // 若注册成功，则显示查看邮件的提示
                                $contents.removeClass('show').filter('._notification')
                                    .children('.highlighted').text(data.email)
                                    .end().addClass('show')
                            } else {
                                // 若该邮箱已注册则提示，稍后移除提示
                                $registerInputEmail.children('.error').text('Email registered.')
                                    .end().addClass('invalid')
                                setTimeout(function() {
                                    $registerInputEmail.removeClass('invalid')
                                        .children('.error').text('Invalid email.')
                                }, 3000)
                            }
                        },
                        fail: function(data) {
                            console.log('failed', data)
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