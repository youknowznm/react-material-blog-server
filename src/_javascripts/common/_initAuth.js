// 登录提示语的映射
const LOGIN_RESULT_MAP = {
    0: 'You entered an unregistered email address.',
    2: 'You entered a wrong password.',
    3: 'Check the verification mail sent to your mailbox.',
    4: 'An internal server error occurred. Please try later.'
}

module.exports = function() {

    /*
    容器相关和方法
    */
    let $body = $('body')
    let $loginArea = $('#login-area')
    let $registerArea = $('#register-area')
    // 当body的authLeval为0（未登录）时，稍后显示登录元素；否则提示登录人身份一次
    setTimeout(function() {
        if ($body.data('authLevel') === 0) {
            $loginArea.addClass('show-partial')
        } else {
            if (localStorage.getItem('userInfoToasted') === null) {
                $.showJmToast({
                    content: `Logged in as ${$body.data('userNickname')}.`,
                    duration: 5000,
                })
                localStorage.setItem('userInfoToasted', true)
            }
        }
    }, 1000)
    // 登录控件的显隐切换
    $body.on('click', function(evt) {
        let $this = $(evt.target)
        if ($this.closest('#login-area').length > 0) {
            $loginArea.addClass('show-full')
        } else if ($this.closest('.jm-dialog-wrap').length === 0 && $this.closest('.jm-toast').length === 0) {
            $loginArea.removeClass('show-full')
        }
    })
    // 方法：控制注册区域的显隐
    function switchRegisterAreaDisplay(option) {
        if (option === true) {
            $body.addClass('no-scroll')
            $registerArea.css('display', 'block')
            setTimeout(function() {
                $registerArea.addClass('show')
            }, 0)
        } else {
            $registerArea.removeClass('show')
            setTimeout(function() {
                $registerArea.css('display', 'none')
                $body.removeClass('no-scroll')
            }, 400)
        }
    }
    // 方法：检查参数对象下的输入元素，在value均有效时使响应的提交按钮可用；否则不可用之
    function watchAreaInputs($target) {
        setInterval(function() {
            let allValid = true
            let $targetConfirmButton = $target.find('.input-check-target')
            let $targetInputs = $target.find('.jm-input')
            $targetInputs.each(function() {
                let $this = $(this)
                let noValue = ($this.find('._input').val() === '')
                if (noValue || $this.is('.invalid')) {
                    allValid = false
                    return false
                }
            })
            $targetConfirmButton.toggleClass('_disabled', !allValid)
        }, 100)
    }

    /*
    登录区域相关
    */
    watchAreaInputs($loginArea)
    $('.to-register-area').on('click', function() {
        switchRegisterAreaDisplay(true)
    })
    // 点击登录按钮
    $('#confirm-login').on('click', function() {
        let $this = $(this)
        if (!$this.hasClass('_disabled')) {
            /*
            *
            * 发送登录请求
            *
            */
            let dataObj = {
                email: $('.login-email ._input').val(),
                password: $('.login-password ._input').val(),
            }
            console.log(dataObj);
            $.ajax({
                contentType: 'application/json',
                url: '/login',
                type: 'Post',
                data: JSON.stringify(dataObj),
                success: function(result) {
                    console.log('--- login result --- \n', result);
                    let code = result.loginResultCode
                    if (code === 1) {
                        location.reload()
                    } else {
                        $.showJmDialog({
                            dialogType: 'alert',
                            title: 'Login failed.',
                            content: LOGIN_RESULT_MAP[code],
                        })
                    }
                },
                fail: function(result) {
                    console.log('--- login fail --- \n', result);
                },
            })
        }
    })

    /*
    注册区域相关
    */
    watchAreaInputs($registerArea)
    $('#cancel-register').on('click', function() {
        switchRegisterAreaDisplay(false)
    })
    // 点击注册按钮
    $('#confirm-register').on('click', function() {
        let $this = $(this)
        if (!$this.hasClass('_disabled')) {
            let pwd1 = $('.register-password ._input').val()
            let pwd2 = $('.register-confirm-password ._input').val()
            // 密码不一致时提示
            if (pwd1 !== pwd2) {
                $.showJmToast({
                    content: 'Please enter consistent passwords.'
                })
            } else {
                /*
                *
                * 发送注册请求
                *
                */
                let dataObj = {
                    email: $registerArea.find('.register-email ._input').val(),
                    nickname: $registerArea.find('.register-nickname ._input').val(),
                    password: $registerArea.find('.register-password ._input').val(),
                }
                $.ajax({
                    contentType: 'application/json',
                    url: '/register',
                    type: 'Post',
                    data: JSON.stringify(dataObj),
                    success: function(result) {
                        switch (result.registerResultCode) {
                            case 0:
                                // 邮箱、密码等参数校验错误
                                $.showJmToast({
                                    content: 'Please check all input values.'
                                })
                                break
                            case 1:
                                // 若注册成功，则显示查看邮件的提示
                                switchRegisterAreaDisplay(false)
                                setTimeout(function() {
                                    $.showJmDialog({
                                        dialogType: 'alert',
                                        title: 'Registration successful.',
                                        content: `Please check the validation email sent to ${dataObj.email}`,
                                    })
                                }, 450)
                                break
                            case 2:
                                // 若该邮箱已注册则提示，稍后移除提示
                                $.showJmToast({
                                    content: 'That email address has been registered.'
                                })
                                break;
                        }
                    },
                    fail: function(result) {
                        console.log('--- registration fail --- \n', result);
                    },
                })
            }
        }
    })

}