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
    let $mdInputElements = $('.md-input, .md-textarea, .md-tag')

    // md-tag元素的内容验证比较复杂。故使用计时器验证
    // 减产所有产生过blur事件的md组件
    setInterval(function() {
        $mdInputElements.each(function() {
            let $this = $(this)
            if ($this.data('edited') === true) {
                checkIfEmpty($(this))
            }
        })
        setSubmitBtnStatus()
    }, 200)

    // 对每个输入容器进行非空验证
    function checkIfEmpty($this) {
        // 根据输入类型的不同分别处理
        switch ($this.is('.md-tag')) {
            case false:

                let val = $this.find('._input').val()
                if (/^\s*$/.test(val)) {
                    $this.addClass('invalid').find('.error').text('This field is required.')
                } else {
                    $this.removeClass('invalid').find('.error').text('')
                }
                break

            case true:

                let $tagInputEle = $this.find('._input')
                if ($tagInputEle.siblings('.tag').length === 0) {
                    $this.addClass('invalid').find('.error').text('At least 1 tag is required.')
                } else {
                    $this.removeClass('invalid').find('.error').text('')
                }
                break
        }
    }

    // 全部非空时启用提交按钮
    function setSubmitBtnStatus() {
        let allValid = true
        $mdInputElements.each(function() {
            let $this = $(this)
            // 根据输入类型的不同分别处理
            switch ($this.is('.md-tag')) {
                case false:

                    let val = $this.find('._input').val()
                    if (/^\s*$/.test(val)) {
                        allValid = false
                    }
                    break

                case true:

                    let tagCount = $this.find('.tag').length
                    if (tagCount === 0) {
                        allValid = false
                    }
                    break
            }
        })
        if (allValid) {
            $s_btn.removeClass('_disabled').addClass('_primary')
        } else {
            $s_btn.removeClass('_primary').addClass('_disabled')
        }
    }

    // 提交
    $s_btn.click(function() {
        if ($(this).is('._disabled')) {
            return
        }
        let _id = $('.main-wrap').data('uid')
        let title = $('._title ._input').val()
        let summary = $('._summary ._input').val()
        let content = $('._content ._input').val()
        let created = new Date().toString()
        let tags = []
        $('._tags').find('.tag-content').each(function() {
            tags.push($(this).text())
        })
        let data = JSON.stringify({
            _id,
            title,
            summary,
            content,
            tags,
            created,
        })
        $.ajax({
            contentType: 'application/json',
            url: '/savePost',
            type: 'Post',
            data,
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

