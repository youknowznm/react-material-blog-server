// md输入框的初始化
import $ from './jquery';

export default function initMdInput() {

    function initInput($mdInput) {
        let $input = $mdInput.children('input');
        let val = $input.attr('value');
        if (val !== undefined) {
            $mdInput.addClass('non-empty');
        } else {
            $mdInput.removeClass('non-empty');
        }
        let currentCharCount = val ? val.length : 0;
        let maxCharCount = $input.attr('maxlength');
        $mdInput.find('.current').text(currentCharCount);
        $mdInput.find('.maximum').text(maxCharCount);
    }

    $('.md-input').each(function() {
        initInput($(this));
    });

    $('.md-input ._input')
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
        // 正则验证
        let valRegExpStr = $wrap.data('validator');
        if (valRegExpStr !== undefined) {
            let valRegExp = new RegExp(valRegExpStr);
            $wrap.toggleClass('invalid', !valRegExp.test($this.val()));
        }
        // 字数验证
        let currentCount = $this.val().length;
        let currentCharCounter = $wrap.find('.current');
        let maxCharCount = +$wrap.find('.maximum').text();
        currentCharCounter.text(currentCount);
        // $wrap.toggleClass('invalid', currentCount === maxCharCount);
    }

}