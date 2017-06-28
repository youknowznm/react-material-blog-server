import $ from '../common/jquery'
import initGDHeader from '../common/gds-header'
import initMdInput from '../common/md-input'
import initMdTag from '../common/md-tag'
import initMdTextarea from '../common/md-textarea'
import initMdButton from '../common/md-button'
import '../../_styles/pages/create.scss'

$(function() {

    initGDHeader()
    initMdInput()
    initMdTag()
    initMdTextarea()
    initMdButton()

    let $s_btn = $('.submit')
    let $mdi = $('.md-input, .md-textarea')

    $('body')
        .on('blur', '.md-input, .md-textarea', function() {
            checkIfEmpty($(this))
            setSubmitBtnStatus()
        })
        .on('keyup', '.md-input, .md-textarea', function() {
            checkIfEmpty($(this))
            setSubmitBtnStatus()
        })

    // 非空验证
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
        let title = $('._title ._input').val()
        let summary = $('._summary ._input').val()
        let content = $('._content ._input').val()
        let created = new Date()
        let tags = []
        $('._tags').find('.tag-content').each(function() {
            tags.push($(this).text())
        })
        console.log(tags)
        $.ajax({
            dataType: 'json',
            url: '/savePosts',
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

})

