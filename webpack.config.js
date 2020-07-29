const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const fs = require('fs')

const isDev = process.env.NODE_ENV === 'develoment'
const isProd = !isDev

const optimization = () => {
    const config =  {
        splitChunks: {
            chunks: 'all'
        }
    }

    if(isProd) {
        config.minimizer = [
            new OptimizeCssAssetsPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config
}
const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`
const cssLoaders = extra => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: true
            }
        },
        'css-loader'
    ]

    if(extra) {
        loaders.push(extra)
    }

    return loaders
}
const PAGES_DIR = path.resolve(__dirname, 'src/pug/pages/')
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill' , './index.js']
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    optimization: optimization(),
    devServer: {
        port: 8081,
        hot: isDev
    },
    devtool: isDev ? 'source-map' : '',
    plugins: [
        ...PAGES.map(
            page => new HtmlWebpackPlugin({
                template: `${PAGES_DIR}/${page}`,
                minify: { collapseWhitespace: isProd},
                filename: `./${page.replace(/\.pug/,'.html')}`
            })
        ),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
            {
                from: path.resolve(__dirname, 'src/assets/img'),
                to: path.resolve(__dirname, 'dist/img')
            }
        ]}),
        new MiniCssExtractPlugin({
            filename: filename('css')
        })
    ],
    module: {
        rules: [
            {
                test: /\.pug$/,
                loader: 'pug-loader'
            },
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')                
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: 'file-loader',
            },
            {
                test: /\.(ttf|woff|woff2|eot|otf)$/i,
                loader: 'file-loader',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ]
                    }
                    }
            }
        ]
    }
}