import $ from './jquery';

export default function initMdButton() {

    // 给予每个按钮下的波纹一定的初始宽度
    function initMdButton($mdButton) {
        let sideLength = $mdButton.innerWidth();
        $mdButton.find('.ripple').css({
            width: sideLength,
            height: sideLength,
        });
    }

    $('.md-button').each(function() {
        initMdButton($(this));
    });

    $('body')
        .on('mousedown', '.md-button', function(evt) {
            let $this = $(this);

            let $ripple = $this.find('.ripple');
            let x = evt.offsetX;
            let y = evt.offsetY;
            let width = $this.innerWidth();
            $ripple.css({
                left: x - width,
                top: y - width,
                width: width * 1.5,
                height: width * 1.5,
            });
            $this.addClass('mousedown');
        })
        .on('mouseup', '.md-button', function() {
            // let $this = $(this);
            // let $ripple = $this.find('.ripple');
            // $this.removeClass('mousedown').addClass('mouseup');
            // setTimeout(function() {
            //     $this.removeClass('mouseup');
            // },500)
        })


}