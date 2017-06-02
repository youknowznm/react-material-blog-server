// md输入框的初始化
import $ from './jquery';

export default function initMdInput() {

    $('._input')
        .on('focus', function() {
            let $this = $(this);
            if ($this.val() === '') {
                $this.parent().addClass('focused');
            }
        })
        .on('blur', function() {
            let $this = $(this);
            if ($this.val() === '') {
                $this.parent().removeClass('focused');
            }
            validate(this);
        })
        .on('keyup', function() {
            validate(this);
        });

    function validate(inputEle) {
        let $this = $(inputEle);
        let $wrap = $(inputEle).parent();
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