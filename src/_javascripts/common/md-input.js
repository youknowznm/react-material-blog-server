// md输入框的初始化
import $ from './jquery';

export default function initMdInput() {

    function initInput($mdInput) {
        let val = $mdInput.children('input').attr('value');
        if (val !== undefined) {
            $mdInput.addClass('non-empty');
        } else {
            $mdInput.removeClass('non-empty');
        }
    }

    $('.md-input').each(function() {
        initInput($(this));
    });

    $('.md-input ._input')
        .on('focus', function() {
            let $this = $(this);
            let $wrap = $this.parent();
            $wrap.addClass('focused');
            if ($this.val() === '') {
                $wrap.removeClass('non-empty');
            } else {
                $wrap.addClass('non-empty');
            }
        })
        .on('blur', function() {
            let $this = $(this);
            let $wrap = $this.parent();
            $wrap.removeClass('focused');
            if ($this.val() === '') {
                $wrap.removeClass('non-empty');
            } else {
                $wrap.addClass('non-empty');
            }
            validate(this);
        })
        .on('keyup', function() {
            validate(this);
        });

    function validate(inputEle) {
        let $this = $(inputEle);
        let $wrap = $this.parent();
        let valRegExpStr = $wrap.data('validatorRegExp');
        if (valRegExpStr !== undefined) {
            let valRegExp = new RegExp(valRegExpStr);
            if (valRegExp.test($this.val())) {
                $wrap.removeClass('invalid');
            } else {
                $wrap.addClass('invalid');
            }
        }
    }

}