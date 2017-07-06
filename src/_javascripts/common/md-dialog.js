import $ from './jquery'

export default function showMdDialog(options) {

    if ($('.md-dialog-wrap').length === 0) {
        let mdDialogHTML = `<div class="md-dialog-wrap">
                    <div class="md-dialog">
                        <h1 class="title">
                            Would you like to delete your debt?
                        </h1>
                        <p class="content">
                            All of the banks have agreed to forgive you your debts.
                        </p>
                        <div class="buttons">
                            <button class="md-button _flat confirm">
                                <span class="content">confirm</span>
                                <div class="ripple-container"><span class="ripple"></span></div>
                            </button>
                            <button class="md-button _flat cancel">
                                <span class="content">cancel</span>
                                <div class="ripple-container"><span class="ripple"></span></div>
                            </button>
                         </div>
                    </div>
                </div>`
        $('body').append($(mdDialogHTML))
    }

    let $wrap = $('.md-dialog-wrap')
    let $dialog = $('.md-dialog')

    function show() {

    }


}
