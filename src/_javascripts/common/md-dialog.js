import $ from './jquery'

/**
@param options {object} title(String) content(String) onConfirm(Function?) onCancel(Function?)
*/
export default function showMdDialog(options) {

    let mdDialogHTML =
            `<div class="md-dialog-wrap">
                <div class="md-dialog">
                    <h1 class="dialog-title">${options.title}</h1>
                    <p class="dialog-content">${options.content}</p>
                    <div class="buttons">
                        <button data-button-type="confirm" class="md-button _flat _primary">
                            <span class="content">confirm</span>
                            <div class="ripple-container"><span class="ripple"></span></div>
                        </button>
                        <button data-button-type="cancel" class="md-button _flat _primary">
                            <span class="content">cancel</span>
                            <div class="ripple-container"><span class="ripple"></span></div>
                        </button>
                     </div>
                </div>
            </div>`
    $('body').append($(mdDialogHTML))

    let $body = $('body')
    let $dialog = $('.md-dialog')
    let $wrap = $('.md-dialog-wrap')

    $body.addClass('no-scroll')
    $dialog.css('transform-origin', '0 0')
    setTimeout(function() {
        $wrap.addClass('show')
    }, 400)

    $dialog.on('click', function(evt) {
        mdDelay(function() {
            let type = $(evt.target).closest('.md-button').data('buttonType')
            $wrap.removeClass('show')
            setTimeout(function() {
                $body.removeClass('no-scroll')
                $wrap.remove()
            }, 400)
            switch (type) {
                case 'confirm':
                    if (typeof options.onConfirm === 'function') {
                        options.onConfirm()
                    }
                    break;
                case 'cancel':
                    if (typeof options.onCancel === 'function') {
                        options.onCancel()
                    }
                    break;
                default:
                    return
            }
        })
    })

}