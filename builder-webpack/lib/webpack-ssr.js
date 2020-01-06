/*
 * @Description:
 * @Author: 胡阳阳
 * @Date: 2019-12-10 08:30:19
 * @LastEditTime: 2019-12-10 20:12:45
 * @LastEditors: 胡阳阳
 */
const merge = require('webpack-merge');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const cssnano = require('cssnano');
const baseConfig = require('./webpack.base');

const ssrConfig = {
  mode: 'production', // 生产模式 默认开启js 压缩
  module: {
    rules: [
      // 服务端渲染不加载css
      {
        test: /\.css$/,
        use: 'ignore-loader',
      },
    ],
  },
  plugins: [
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano, // css 预处理器
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://cdn.jsdelivr.net/npm/react@16.10.0/index.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://cdn.jsdelivr.net/npm/react-dom@16.10.0/index.min.js',
          global: 'ReactDOM',
        },
      ],
    }),
  ],
  // 分包处理
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
        name: 'commons',
        chunks: 'all',
        minChunks: 2,
        // }
      },
    },
  },
};

module.exports = merge(baseConfig, ssrConfig);
