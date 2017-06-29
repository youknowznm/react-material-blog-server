import $ from './jquery'

export default function initMdTag() {

    function initTag($mdtag) {
        let tagsData = $mdtag.data('md-tags')
        if ($mdtag.find('.tag').length > 0) {
            $mdtag.addClass('non-empty')
        }
        let $input = $mdtag.find('._input')
        let currentCharCount = 0
        let maxCharCount = $input.attr('maxlength')
        $mdtag.find('.current').text(currentCharCount)
        $mdtag.find('.maximum').text(maxCharCount)
    }

    $('.md-tag').each(function() {
        initTag($(this))
    })

    $('.md-tag ._input')
        .on('focus', function() {
            let $this = $(this)
            let $mdtag = $this.parents('.md-tag')
            if ($this.val() === '') {
                $mdtag.addClass('focused')
            }
        })
        .on('blur', function() {
            let $this = $(this)
            let $mdtag = $this.parents('.md-tag')
            if ($this.val() === '') {
                $mdtag.removeClass('focused')
            }
            if ($mdtag.find('.tag').length > 0) {
                $mdtag.addClass('non-empty')
            }
        })
        .on('keydown', function() {
            forbidSymbolInput($(this))
        })
        .on('input', function() {
            forbidSymbolInput($(this))
        })
        .on('keyup', function(evt) {
            let $this = $(this)
            let $mdtag = $this.parents('.md-tag')
            let $error = $mdtag.find('.error')
            let tags = $mdtag.find('.tag')
            let tagCount = tags.length
            forbidSymbolInput($this)
            if (evt.keyCode === 13) {
                let val = $this.val().trim()
                $this.val('')
                if (/\S/.test(val)) {
                    if (tagCount === 3) {
                        showError($error, 'Maximum tags reached.')
                        return
                    }
                    // 同名标签限制
                    for (let c of tags) {
                        if (c.innerText === val) {
                            showError($error, 'Tag already exists.')
                            return
                        }
                    }
                    $this.before(
                        $(`<span class="tag"><span class="tag-content">${val}</span><i class="btn-remove"></i></span>`)
                    )
                }
            }
            // 字数验证
            let currentCount = $this.val().length
            let currentCharCounter = $mdtag.find('.current')
            let maxCharCount = +$mdtag.find('.maximum').text()
            currentCharCounter.text(currentCount)
        })

    $('.md-tag').on('click', function() {
        let $tar = $(this).find('._input')
        if (!$tar.is(':focus')) {
            $tar.focus()
        }
    })

    $('.md-tag').on('click', '.btn-remove', function(evt) {
        let $tar = $(evt.target).parent('.tag')
        $tar.fadeOut(function() {
            $tar.remove()
        })
    })

    function showError($ele, str) {
        $ele.closest('.md-tag').addClass('invalid')
        $ele.text(str).addClass('show')
        setTimeout(function() {
            $ele.removeClass('show')
            $ele.closest('.md-tag').removeClass('invalid')
        }, 3000)
    }

    // 禁止输入中文、英文、数字、空格之外的字符
    function forbidSymbolInput($this) {
        $this.val($this.val().replace(/[^a-zA-Z0-9\s\u4E00-\u9FA5]/g, ''))
    }

}
