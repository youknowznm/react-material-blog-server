const webpack = require('webpack')
const path = require('path')
const fs = require('fs')

const INPUT_PATH = path.join(__dirname, 'static/src/_javascripts/pages')
const OUTPUT_PATH = path.join(__dirname, 'static/dist/javascripts/pages')

let pages = fs.readdirSync(INPUT_PATH)

let entries = {
    _util: ['jquery'],
}

pages.forEach((pageDir, index, array) => {
    entries[pageDir] = path.join(INPUT_PATH, pageDir, 'index.js')
})

console.log(entries)

module.exports = {
    entry: entries,
    output: {
        path: path.resolve(__dirname, OUTPUT_PATH),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            // {
            //     test: /\.sass$/,
            //     loader: 'sass',
            // },
            // {
            //     test: /\.css$/,
            //     loader: 'css',
            // },
            // {
            //     test: /\.(png|jpg)$/,
            //     loader: 'babel',
            // },

        ],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: '_util',
            filename: 'util.js',
        }),
        new webpack.optimize.UglifyJsPlugin({

        }),
    ],
}
