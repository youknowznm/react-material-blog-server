import $ from './jquery';

export default function initMdInput() {

    function initInput($mdInput) {
        let $input = $mdInput.find('input');
        let val = $input.attr('value');
        $mdInput.toggleClass('non-empty', val !== undefined);
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
            let $wrap = $this.parents('.md-input');
            $wrap.addClass('focused');
            $wrap.toggleClass('non-empty', $this.val() !== '');
        })
        .on('blur', function() {
            let $this = $(this);
            let $wrap = $this.parents('.md-input');
            $wrap.removeClass('focused');
            $wrap.toggleClass('non-empty', $this.val() !== '');
            validate(this);
        })
        .on('keyup', function() {
            validate(this);
        });

    function validate(inputEle) {
        let $this = $(inputEle);
        let $wrap = $this.parents('.md-input');
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