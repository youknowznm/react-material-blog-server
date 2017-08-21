import $ from '../common/jquery'
import '../../_styles/pages/edit.scss'

$(function() {

    let $mdInputElements = $('.main').find('.md-input, .md-textarea, .md-tag')

    let $titleInput = $('#input_1')
    let $summaryInput = $('#input_2')
    let $contentInput = $('#input_3')

    let $submitBtn = $('#submit')
    let $cancelBtn = $('#cancel')

    // 动画banner的top值和内容输入框高度
    $('body').animate(
        {
            'scrollTop': 210
        },
        function() {
            $contentInput.animate(
                {
                    'height': window.innerHeight - 315
                },
            )
        }
    )

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

    // 对每个输入容器进行非空验证，验证失败添加invalid样式
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
        $submitBtn.toggleClass('_disabled', !allValid)
    }

    // 提交
    $submitBtn.click(function() {
        if ($(this).is('._disabled')) {
            return
        }
        let _id = $('.main-wrap').data('uid')
        let title = $titleInput.val().trim()
        let summary = $summaryInput.val().trim()
        let content = $contentInput.val().trim()
        let type = $('[data-selected=true]').data('name')
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
            type,
        })
        $.ajax({
            contentType: 'application/json',
            url: '/saveArticle',
            type: 'Post',
            data,
            success: function(result) {
                console.log('--- save success --- \n', result)
                let articleId = result._id
                if (articleId !== undefined) {
                    // 保存成功
                    location.assign(`/articles/${articleId}`)
                } else if (result.unauthorized === true) {
                    // 对话过期，保存失败
                    rhaegoUtil.showMdModal({
                        isDialog: false,
                        title: 'Authentication expired.',
                        content: 'Please re-login.',
                        onCancel() {
                            location.reload()
                        },
                    })
                } else {
                    // 其它原因导致的保存失败
                    rhaegoUtil.showMdModal({
                        isDialog: false,
                        title: 'Save article failed.',
                        content: 'An error occurred during saving. Please try agin later.'
                    })
                }
            },
            fail: function(result) {
                console.log('--- save fail --- \n', result)
            },
        })
    })

    $cancelBtn.click(function() {
        rhaegoUtil.showMdModal({
            isDialog: true,
            title: 'Leave this page?',
            content: 'Unsaved contents will be discarded.',
            onConfirm() {
                window.history.go(-1)
            },
        })
    })

})

