import $ from './jquery';

export default function initMdChip() {

    function initChip($mdChip) {
        let chipsData = $mdChip.data('md-chips');
        if ($mdChip.find('.chip').length > 0) {
            $mdChip.addClass('non-empty');
        }
        let $input = $mdChip.find('._input');
        let currentCharCount = 0;
        let maxCharCount = $input.attr('maxlength');
        $mdChip.find('.current').text(currentCharCount);
        $mdChip.find('.maximum').text(maxCharCount);
    }

    $('.md-chip').each(function() {
        initChip($(this));
    });

    $('.md-chip ._input')
        .on('focus', function() {
            let $this = $(this);
            let $mdChip = $this.parents('.md-chip');
            if ($this.val() === '') {
                $mdChip.addClass('focused');
            }
        })
        .on('blur', function() {
            let $this = $(this);
            let $mdChip = $this.parents('.md-chip');
            if ($this.val() === '') {
                $mdChip.removeClass('focused');
            }
            if ($mdChip.find('.chip').length > 0) {
                $mdChip.addClass('non-empty');
            }
        })
        .on('keyup', function(evt) {
            let $this = $(this);
            let $mdChip = $this.parents('.md-chip');
            let $error = $mdChip.find('.error');
            let chips = $mdChip.find('.chip');
            let chipCount = chips.length;
            if (evt.keyCode === 13) {
                let val = $this.val().trim();
                $this.val('');
                if (/\S/.test(val)) {
                    // 最大标签数量限制
                    if (chipCount === 3) {
                        showError($error, 'Maximum tags reached.');
                        return;
                    }
                    // 同名标签限制
                    for (let c of chips) {
                        if (c.innerText === val) {
                            showError($error, 'Tag already exists.');
                            return;
                        }
                    }
                    $this.before(
                        $(`<span class="chip">${val}<i class="btn-remove"></i></span>`)
                    );
                }
            }
            // 字数验证
            let currentCount = $this.val().length;
            let currentCharCounter = $mdChip.find('.current');
            let maxCharCount = +$mdChip.find('.maximum').text();
            currentCharCounter.text(currentCount);
        });

    $('.md-chip').on('click', function() {
        let $tar = $(this).find('._input');
        if (!$tar.is(':focus')) {
            $tar.focus();
        }
    });

    $('.md-chip').on('click', '.btn-remove', function(evt) {
        let $tar = $(evt.target).parent('.chip');
        $tar.fadeOut(function() {
            $tar.remove();
        });
    });

    function showError($ele, str) {
        $ele.text(str).addClass('show');
        setTimeout(function() {
            $ele.removeClass('show');
        }, 3000);
    }

}