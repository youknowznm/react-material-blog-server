import $ from "./jquery"

let generateMaterialBackground = function($ele) {

    let $mdBgWrap = $('<div class="md-bg-wrap"></div>')

    let currentZIndex = 1
    let mdBlockCount = Math.floor(Math.random() * 8 + 6)

    for (let i = 0; i < blockCount; i++) {
        addMdBlock()
        currentZIndez++
    }

    function addMdBlock() {
        let shadowStrength = (Math.random() < .5) ? 'light' : 'strong'
    }

}

export default generateMaterialBackground