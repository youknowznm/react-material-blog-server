import $ from './jquery';

export default function initMdButton() {

    $('body')
        .on('mousedown', '.md-button', function(evt) {
            let $this = $(this);
            if ($this.attr('data-animating') === 'false') {
                $this.attr('data-clicked', 'true');
                let $ripple = $this.find('.ripple');
                let _x = evt.offsetX;
                let _y = evt.offsetY;
                let _width = $this.innerWidth();
                let _height = $this.innerHeight();
                // 根据事件坐标和按钮水平中点的距离，获取波纹的直径
                let offsetToHorizontalCenter = _width / 2 - _x;
                let offsetToVerticalCenter = _height / 2 - _y;
                let sideLength = _width + Math.abs(offsetToHorizontalCenter) * 2 + (_width / 10);
                $ripple.css({
                    width: sideLength,
                    height: sideLength,
                    left: (_width - sideLength) / 2 - offsetToHorizontalCenter,
                    top: (_height - sideLength) / 2 - offsetToVerticalCenter,
                });
                $this.addClass('mousedown');
            }
        })
        .on('mouseup mouseout', '.md-button', function() {
            let $this = $(this);
            if ($this.attr('data-animating') === 'false' && $this.attr('data-clicked') === 'true') {
                $this.attr('data-animating', 'true');
                $this.attr('data-clicked', 'false');
                $this.removeClass('mousedown').addClass('mouseup');
                setTimeout(function() {
                    $this.removeClass('mouseup');
                    $this.attr('data-animating', 'false');
                }, 250);
            }
        })


}