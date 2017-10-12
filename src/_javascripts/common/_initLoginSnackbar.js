module.exports = function() {

    let $body = $('body')

    let $loginArea = $('#login-area')
    let $loginButton = $loginArea.find('#confirm-login')

    let $registerArea = $('#register-area')
    let $registerButton = $registerArea.find('#confirm-register')
    let $cancelRegisterButton = $registerArea.find('#cancel-register')

    // 根据body的authLeval控制登录控件的显隐
    setTimeout(function() {
        if ($body.data('authLevel') === 0) {
            // $loginArea.addClass('show-partial')
            $loginArea.addClass('show-partial show-full')
        }
    }, 500)

    // 登录控件的显隐切换
    $body.on('click', function(evt) {
        let $this = $(evt.target)
        if ($this.closest('#login-area').length > 0) {
            $loginArea.addClass('show-full')
        } else if ($registerArea.css('display') === 'none') {
            $loginArea.removeClass('show-full')
        }
    })

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

    function watchInputs($target) {
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

    watchInputs($loginArea)
    watchInputs($registerArea)

    $cancelRegisterButton.on('click', function() {
        switchRegisterAreaDisplay(false)
    })

    $('.to-register-area').on('click', function() {
        switchRegisterAreaDisplay(true)
    })

    // 点击登录按钮
    $loginButton.on('click', function() {
        let $this = $(this)
        if (!$this.hasClass('invalid')) {
            /*
            *
            * 发送登录请求
            *
            */
            let data = JSON.stringify({
                email: $('.login-email').children('._input').val(),
                password: $('.login-email').children('._input').val(),
            })
            $.ajax({
                contentType: 'application/json',
                url: '/login',
                type: 'Post',
                data,
                success: function(result) {
                    console.log('--- login result --- \n', result);
                    let code = result.loginResultCode
                    if (code === 1) {
                        location.reload()
                    } else {
                        const NOTIFICATIONS = {
                            0: 'You inputed an unregistered email address.',
                            2: 'You inputed a wrong password.',
                            3: 'Check the verification mail sent to that mailbox.',
                            4: 'An internal server error occurred. Please try later.'
                        }
                        rhaegoUtil.showJmModal({
                            isDialog: false,
                            title: 'Login failed.',
                            content: NOTIFICATIONS[code],
                            onCancel() {
                                $loginArea.addClass('show-full')
                            },
                        })
                    }
                },
                fail: function(result) {
                    console.log('--- login fail --- \n', result);
                },
            })
        }
    })

    // 点击注册按钮
    $registerButton.on('click', function() {
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
            /*
            *
            * 发送注册请求
            *
            */
            let data = JSON.stringify({
                email: $registerInputEmail.children('._input').val(),
                nickname: $registerInputNickname.children('._input').val().trim(),
                password: $registerInputConfirmPassword.children('._input').val(),
            })
            $.ajax({
                contentType: 'application/json',
                url: '/register',
                type: 'Post',
                data,
                success: function(result) {
                    switch (result.registerResultCode) {
                        case 0:
                            // 邮箱、密码等参数校验错误
                            rhaegoUtil.showJmModal({
                                isDialog: false,
                                title: 'Parameter validation failed.',
                                content: 'Please check all input elements.',
                            })
                            break
                        case 1:
                            // 若注册成功，则显示查看邮件的提示
                            $divisions.removeClass('show').filter('._notification')
                                .children('.highlighted').text(data.email)
                                .end().addClass('show')
                            break
                        case 2:
                            // 若该邮箱已注册则提示，稍后移除提示
                            $registerInputEmail.children('.error').text('Email registered.')
                                .end().addClass('invalid')
                            setTimeout(function() {
                                $registerInputEmail.removeClass('invalid')
                                    .children('.error').text('Invalid email.')
                            }, 3000)
                            break;
                    }
                },
                fail: function(result) {
                    console.log('failed', result)
                },
            })
        }
    })

}