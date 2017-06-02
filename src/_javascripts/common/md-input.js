// md输入框的初始化
import $ from './jquery';

export default function initMdInput() {

    $('.md-input ._input')
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

    $('.md-input.md-chip ._input')
        .on('keyup', function(evt) {
            let $this = $(this);
            let $wrap = $this.parent();
            let chipCount = 0;
            if (evt.keyCode === 13) {
                let val = $this.val();
                if (/\S/.test(val) && chipCount < 4) {
                    $wrap.append(
                        $(`<span class="chip">${val}<i class="remove"></i></span>`)
                    );
                    chipCount++;
                }
            }
        })

    function getChip(chipContent) {

    }

}