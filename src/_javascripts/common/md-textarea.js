// md输入框的初始化
import $ from './jquery';

export default function initMdTextarea() {

    function initTextarea($mdTextarea) {
        let $textarea = $mdTextarea.children('textarea');
        let val = $textarea.text();
        $mdTextarea.toggleClass('non-empty', val !== '');
        let currentCharCount = val ? val.length : 0;
        let maxCharCount = $textarea.attr('maxlength');
        $mdTextarea.find('.current').text(currentCharCount);
        $mdTextarea.find('.maximum').text(maxCharCount);
    }

    $('.md-textarea').each(function() {
        initTextarea($(this));
    });

    $('.md-textarea ._input')
        .on('focus', function() {
            let $this = $(this);
            let $wrap = $this.parent();
            $wrap.addClass('focused');
            $wrap.toggleClass('non-empty', $this.val() !== '');
        })
        .on('blur', function() {
            let $this = $(this);
            let $wrap = $this.parent();
            $wrap.removeClass('focused');
            $wrap.toggleClass('non-empty', $this.val() !== '');
            validate(this);
        })
        .on('keyup', function() {
            validate(this);
        });

    function validate(inputEle) {
        let $this = $(inputEle);
        let $wrap = $this.parent();
        // 字数验证
        let currentCount = $this.val().length;
        let currentCharCounter = $wrap.find('.current');
        let maxCharCount = +$wrap.find('.maximum').text();
        currentCharCounter.text(currentCount);
        // $wrap.toggleClass('invalid', currentCount === maxCharCount);
    }

}