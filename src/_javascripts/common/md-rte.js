import $ from 'jquery'

/**
@param
*/
export default function initMdRte(options) {
    let $mdRte = $('.md-rte')
    let $actions = $mdRte.children('.actions')
    let actionArr = [
        {
            abbr: 'b',
            title: 'bold',
            action: () => format('bold'),
        },
        {
            abbr: 'i',
            title: 'italic',
            action: () => format('italic'),
        },
        {
            abbr: 'u',
            title: 'underline',
            action: () => format('underline'),
        },
        {
            abbr: 's',
            title: 'strikethrough',
            action: () => format('strikeThrough'),
        },
        {
            abbr: 'h',
            title: 'header',
            action: () => format('formatBlock', '<h1>'),
        },
        {
            abbr: 'p',
            title: 'paragraph',
            action: () => format('formatBlock', '<p>'),
        },
        {
            abbr: 'q',
            title: 'quote',
            action: () => format('formatBlock', '<blockquote>'),
        },
        {
            abbr: 'ol',
            title: 'ordered list',
            action: () => format('insertOrderedList'),
        },
        {
            abbr: 'ul',
            title: 'unordered list',
            action: () => format('insertUnrderedList'),
        },
        {
            abbr: 'code',
            title: 'code',
            action: () => format('formatBlock', '<pre>'),
        },
        {
            abbr: 'hr',
            title: 'horizontal line',
            action: () => format('insertHorizontalRule'),
        },
        {
            abbr: 'link',
            title: 'link',
            action: () => null,
        },
        {
            abbr: 'image',
            title: 'image',
            action: () => null,
        },
    ]
}