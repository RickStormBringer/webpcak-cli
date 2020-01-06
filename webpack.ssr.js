/*
 * @Description: 
 * @Author: 胡阳阳
 * @Date: 2019-10-28 19:17:45
 * @LastEditTime: 2019-12-10 19:34:12
 * @LastEditors: 胡阳阳
 */
const path = require("path");
const glob = require("glob");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const vendor = [
    'react',
    'react-dom'
];

module.exports = {
    mode: "none",
    // mode: "production",
    entry: {
        search: "./src/search/index-server.js",
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name]-server.js",
        libraryTarget: "umd"
    },
    devServer: {
        contentBase: "./dist/index.html",
        hot: true
    },
    plugins: [
        // 生成css文件指纹
        new MiniCssExtractPlugin({
            filename: "[name]_[contenthash:8].css",
        }),
        // 压缩css
        new OptimizeCssAssetsWebpackPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano') //css 预处理器
        }),
        // new HtmlWebpackPlugin({
        //     template: path.join(__dirname, 'src/search.html'),
        //     filename: 'search.html',
        //     chunks: ['search'],
        //     inject: true,
        //     minify: {
        //         html5: true,
        //         collapseWhitespace: true,
        //         preserveLineBreaks: false,
        //         minifyCSS: true,
        //         minifyJS: true,
        //         removeComments: false
        //     }
        // }),
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //       {
        //         module: 'react',
        //         entry: 'https://cdn.jsdelivr.net/npm/react@16.10.0/index.min.js',
        //         global: 'React',
        //       },
        //       {
        //         module: 'react-dom',
        //         entry: 'https://cdn.jsdelivr.net/npm/react-dom@16.10.0/index.min.js',
        //         global: 'ReactDOM',
        //       }
        //     ],
        //   }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/search/index.html'),
            filename: 'search.html',
            chunks: ['search'],
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: false
            }
        }),
    ],
    optimization: {
        splitChunks: {
            minSize: 0,
            cacheGroups: {
                // commons: {
                //     //  切割react包
                //     // test: /(react|react-dom)/,
                //     // name: "vendors",
                //     // chunks: "all",
                //     // 切割公用组件 添加到chunks
                //     name: "commons",
                //     chunks:"all",
                //     minChunks: 2,
                // }
            }
        }
    },
    module: {
        rules: [
            {
                test: /.js$/,
                use: ["babel-loader"]
            },
            {
                test: /.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: () => [
                                require('autoprefixer')({
                                    browsers: ['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                        }
                    },
                    {
                        loader: "px2rem-loader",
                        options: {
                            remUni: 75, //1rem =75px;
                            remPrecision: 8
                        }
                    }
                ]
            },
            {
                test: /.(png|jpg|jpeg|gif)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: '[name]_[hash:8].[ext]'
                    }
                }
            },
        ]
    },
    devtool: "inline-source-map"
}
