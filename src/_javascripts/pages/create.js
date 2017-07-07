import $ from '../common/jquery'
import '../../_styles/pages/create.scss'

$(function() {

    // 动画banner的top值和内容输入框高度
    $('body').animate(
        {
            'scrollTop': 210
        },
        function() {
            $('#input_4').animate(
                {
                    'height': window.innerHeight - 360
                },
            )
        }
    )

    let $s_btn = $('.submit')
    let $mdi = $('.md-input, .md-textarea')

    // 检查输入内容，控制提交按钮样式
    $('body')
        .on('blur', '.md-input, .md-textarea', function() {
            checkIfEmpty($(this))
            setSubmitBtnStatus()
        })
        .on('keyup', '.md-input, .md-textarea', function() {
            checkIfEmpty($(this))
            setSubmitBtnStatus()
        })

    // 对每个输入容器进行非空验证
    function checkIfEmpty($this) {
        let val = $this.find('._input').val()
        if (/^\s*$/.test(val)) {
            $this.addClass('invalid').find('.error').text('This field is required.')
        } else {
            $this.removeClass('invalid').find('.error').text('')
        }
    }

    // 全部非空时启用提交按钮
    function setSubmitBtnStatus() {
        let allValid = true
        $mdi.each(function() {
            let val = $(this).find('._input').val()
            if (/^\s*$/.test(val)) {
                allValid = false
            }
        })
        if (allValid) {
            $s_btn.removeClass('_disabled').addClass('_primary')
        } else {
            $s_btn.removeClass('_primary').addClass('_disabled')
        }
    }

    $s_btn.click(function() {
        if ($(this).is('._disabled')) {
            return
        }
        let _id = $('.main-wrap').data('uid')
        let title = encodeURIComponent($('._title ._input').val())
        let summary = encodeURIComponent($('._summary ._input').val())
        let content = encodeURIComponent($('._content ._input').val())
        let created = new Date().toString()
        let tags = ''
        $('._tags').find('.tag-content').each(function() {
            tags += '<&>' + $(this).text()
        })
        tags = encodeURIComponent(tags)
        $.ajax({
            dataType: 'json',
            url: '/savePost',
            type: 'Post',
            data: {
                _id,
                title,
                summary,
                content,
                tags,
                created,
            },
            success: function(data) {
                console.log('s', data)
            },
            fail: function(data) {
                console.log('f', data)
            },
        })
    })

    $('.cancel').click(function() {
        showMdDialog({
            title: 'Leave this page?',
            content: 'Blog content shall be discarded.',
            onConfirm: function() {
                location.pathname = '/blogs'    
            }
        })
    })

})

