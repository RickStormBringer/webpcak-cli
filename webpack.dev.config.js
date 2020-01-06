/*
 * @Description: 
 * @Author: 胡阳阳
 * @Date: 2019-10-28 19:17:45
 * @LastEditTime: 2019-12-09 19:21:22
 * @LastEditors: 胡阳阳
 */
const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require("glob");
const NotifierPlugin = require('friendly-errors-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
//  读取入口文件
const setMPA = () => {
    const entryFiles = glob.sync(path.resolve(__dirname, './src/*/index.js'))
    const entry = {}
    const htmlWebpackPlugins = []
    entryFiles.forEach(file => {
        const entryArr = file.match(/src\/(.*)\/index.js/)
        const entryName = entryArr[1]
        const entryPath = entryArr[0]
        entry[entryName] = `./${entryPath}`
        htmlWebpackPlugins.push(new HtmlWebpackPlugin({
            template: path.join(__dirname, entryPath.replace(/index.js/, 'index.html')),
            filename: entryName + '.html',
            chunks: [entryName],
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: false
            }
        }))
    })
    return {
        entry,
        htmlWebpackPlugins
    }
}
const {entry, htmlWebpackPlugins} = setMPA()
module.exports = {
    mode: "development",
    entry,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js"
    },
    plugins:[
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new NotifierPlugin(),
        ...htmlWebpackPlugins,
    ],
    devServer: {
        contentBase: "./dist",
        hot:true
    },
    // devtool: "source-map",
    stats: "errors-only",
    module: {
        rules: [
            {
                test: /.js$/,
                use: "babel-loader"
            },
            {
                test: /.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test:/.(png|jpg|jpeg|gif)$/,
                use:"file-loader"
            },
        ]
    }
}
