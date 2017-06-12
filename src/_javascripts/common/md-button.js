import $ from './jquery';

export default function initMdButton() {

    // function initMdButton($mdButton) {
    //
    // }
    //
    // $('.md-button').each(function() {
    //     initbutton($(this));
    // });

    $('body')
        .on('mousedown', '.md-button', function(evt) {
            let $this = $(this);

            let $ripple = $this.find('.ripple');

            let x = evt.offsetX;
            let y = evt.offsetY;
            let width = $this.innerWidth();
            let height = $this.innerHeight();
            let sideLength = width * 2;

            $ripple.css({
                left: x - width,
                top: y - width,
                width: sideLength,
                height: sideLength,
            })

            $this.addClass('mousedown');

        })
        .on('mouseup', '.md-button', function() {
            let $this = $(this);
            let $ripple = $this.find('.ripple');
            $ripple.css('animation-play-state', 'paused');
            $this.removeClass('mousedown')
            $ripple.css('animation-pl÷ay-state', 'running');
        })


}