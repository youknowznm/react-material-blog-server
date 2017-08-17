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
    let $mdInputElements = $('.main').find('.md-input, .md-textarea, .md-tag')

    // md-tag元素的内容验证比较复杂。故使用计时器验证
    // 检查所有产生过blur事件的md组件
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
        for (let ele of $mdInputElements) {
            let $this = $(ele)
            // 根据输入类型的不同分别处理
            if ($this.is('.md-tag')) {

                let tagCount = $this.find('.tag').length
                if (tagCount === 0) {
                    allValid = false
                    break
                }

            } else {

                let val = $this.find('._input').val()
                if (/^\s*$/.test(val)) {
                    allValid = false
                    break
                }

            }
        }
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
        let title = $('._title ._input').val().trim()
        let summary = $('._summary ._input').val().trim()
        let content = $('._content ._input').val().trim()
        let created = new Date().toString()
        let tags = []
        $('._tags').find('.tag-content').each(function() {
            tags.push($(this).text().trim())
        })
        let data = JSON.stringify({
            _id,
            title,
            summary,
            content,
            tags,
            created,
        })
        /*
        常规URL的正则匹配：
        开始 + 可选的http或https协议名 + 一个以上的（一个以上的字母或数字或'-' + '.'） + 一个以上的字母或数字 + 一个以上的（'/' + 一个以上的非空格字符 ） + 结尾
         */
        switch (/^(http:\/\/|https:\/\/)?([\w-]+\.)+[\w-]+(\/\S+)+$/.test(content)) {
            // 当content元素的value符合URL格式时，发送储存为product（产品）的请求
            case true:
                $.ajax({
                    contentType: 'application/json',
                    url: '/saveProduct',
                    type: 'Post',
                    data,
                    success: function(data) {
                        console.log('--- save PRODUCT success --- \n', data)
                        let productId = data._id
                        if (productId !== undefined) {
                            location.assign(`/products/${productId}`)
                        } else {
                            // TODO 保存失败
                        }
                    },
                    fail: function(data) {
                        console.log('--- save PRODUCT fail --- \n', data)
                    },
                })
                return
            // 否则发送储存为post（文章）的请求
            case false:
                $.ajax({
                    contentType: 'application/json',
                    url: '/savePost',
                    type: 'Post',
                    data,
                    success: function(data) {
                        console.log('--- save POST success --- \n', data)
                        let postId = data._id
                        if (postId !== undefined) {
                            location.assign(`/posts/${postId}`)
                        } else {
                            // TODO 保存失败
                        }
                    },
                    fail: function(data) {
                        console.log('--- save POST fail --- \n', data)
                    },
                })
                return
        }
    })

    $('.cancel').click(function() {
        rhaegoUtil.showMdDialog({
            title: 'Leave this page?',
            content: 'Unsaved contents will be discarded.',
            onConfirm: function() {
                location.assign('/posts')
            }
        })
    })

})

