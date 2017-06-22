const i18n = require('i18n')

i18n.configure({
    locales: [
        'zh-CN',
        'en-US',
    ],
    cookie: 'rhaegoLocale',
    defaultLocale: 'en-US',
    objectNotation: true,
})