/*
 * @Description:
 * @Author: 胡阳阳
 * @Date: 2019-12-10 08:23:53
 * @LastEditTime: 2019-12-16 15:50:09
 * @LastEditors: 胡阳阳
 */

const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base');

const devConfig = {
  mode: 'production', // 生产模式 默认开启js 压缩
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
    //  命令行 只输出错误
    stats: 'errors-only',
  },
  devtool: 'source-map',
};

module.exports = merge(baseConfig, devConfig);
