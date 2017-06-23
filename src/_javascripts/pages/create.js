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

    // 非空验证
    $('body').on('blur', '.md-input, .md-textarea', function() {
        let $this = $(this)
        let val = $this.find('._input').val()
        if (/^\s*$/.test(val)) {
            $this.addClass('invalid').find('.error').text('This field is required.')
            $s_btn.removeClass('_primary').addClass('_disabled')
        } else {
            $this.removeClass('invalid').find('.error').text('')
            $s_btn.removeClass('_disabled').addClass('_primary')
        }
    })

    $s_btn.click(function() {
        
    })

})

