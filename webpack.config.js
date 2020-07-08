const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {

    context: path.resolve(__dirname, 'src'),
    entry: {
        index: './index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },

    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                  'style-loader',
                  'css-loader',
                  'sass-loader',
                ],
              },
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            minify: false,
            template: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'css/style.css'
        })
    ]

}