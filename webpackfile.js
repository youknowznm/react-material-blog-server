const webpack = require('webpack')
const path = require('path')
const fs = require('fs')

const INPUT_PATH = path.join(__dirname, '/src/_javascripts/pages/')
const OUTPUT_PATH = path.join(__dirname, '/dist/')

// 公用模块
let entries = {
    common: [
        path.join(__dirname, '/src/_javascripts/common/common.js'),
    ],
}

// 多个打包入口
let pages = fs.readdirSync(INPUT_PATH)

pages.forEach((pageName, index, array) => {
    if (!/^\./.test(pageName)) {
        entries[pageName] = path.join(INPUT_PATH, pageName)
    }
})

// const extractSass = new ExtractTextPlugin({
//     filename: "[name].[contenthash].css",
//     disable: process.env.NODE_ENV === "development"
// });

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
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader" // 将 JS 字符串生成为 style 节点
                    },
                    {
                        loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
                    },
                    {
                        loader: "sass-loader" // 将 Sass 编译成 CSS
                    },
                ],
            },
            {
                // IDEA: webpack 字体打包
                test: /\.(jpg|png|ttf)$/,
                use: {
                    loader: 'url-loader',
                },
            },
        ],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'common.js',
            minChunks: Infinity,
        }),
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     sourceMap: true,
        //     compress: {
        //         warnings: true,
        //     },
        // }),
    ]
}
