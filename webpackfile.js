const webpack = require('webpack')
const path = require('path')
const fs = require('fs')

// 输入目录
const INPUT_PATH = path.join(__dirname, '/src/_javascripts/pages/')
// 输出目录
const OUTPUT_PATH = path.join(__dirname, '/dist/javascripts/')

// 公用模块
let entries = {
    common: [
        path.join(__dirname, '/src/_javascripts/common/jquery.js'),
        path.join(__dirname, '/src/_javascripts/common/gds-header.js'),
    ],
}

// 多个打包入口
let pages = fs.readdirSync(INPUT_PATH)
pages.forEach((pageName, index, array) => {
    if (!/^\./.test(pageName)) {
        entries[pageName] = path.join(INPUT_PATH, pageName)
    }
})

module.exports = {
    watch: true,
    entry: entries,
    output: {
        path: path.resolve(__dirname, OUTPUT_PATH),
        filename: '[name]',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015'],
                    },
                },
            },
        ],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'common.js',
            // minChunks: Infinity,
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: true,
            },
        }),
    ],
}
