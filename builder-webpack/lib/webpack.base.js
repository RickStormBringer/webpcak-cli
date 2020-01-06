/*
 * @Description:
 * @Author: 胡阳阳
 * @Date: 2019-12-09 20:07:54
 * @LastEditTime: 2019-12-12 07:30:15
 * @LastEditors: 胡阳阳
 */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
// 命令行优化
const NotifierPlugin = require('friendly-errors-webpack-plugin');
const path = require('path');
const glob = require('glob');
// 将dirname 设置为当前程序执行的目录
const projectRoot = process.cwd();

const setMPA = () => {
  const entryFiles = glob.sync(path.resolve(projectRoot, './src/*/index.js'));
  const entry = {};
  const htmlWebpackPlugins = [];
  entryFiles.forEach((file) => {
    const entryArr = file.match(/src\/(.*)\/index.js/);
    const entryName = entryArr[1];
    const entryPath = entryArr[0];
    entry[entryName] = `./${entryPath}`;
    htmlWebpackPlugins.push(new HtmlWebpackPlugin({
      template: path.join(projectRoot, entryPath.replace(/index.js/, 'index.html')),
      filename: `${entryName}.html`,
      // chunks: [entryName, "vendors"],
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false,
      },
    }));
  });
  // entry.vendor = vendor;
  return {
    entry,
    htmlWebpackPlugins,
  };
};
const { entry, htmlWebpackPlugins } = setMPA();
module.exports = {
  entry,
  output: {
    path: path.resolve(projectRoot, 'dist'),
    filename: '[name]_[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: ['babel-loader'],
      },
      {
        test: /.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({
                  browsers: ['last 2 version', '>1%', 'ios 7'],
                }),
              ],
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUni: 75, // 1rem =75px;
              remPrecision: 8,
            },
          },
        ],
      },
      {
        test: /.(png|jpg|jpeg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash:8].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    // 生成css文件指纹
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    ...htmlWebpackPlugins,
    new CleanWebpackPlugin(),
    new NotifierPlugin(),
    // 主动触发并捕获错误
    function () {
      //  this为compiler 对象
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
          console.log('build error');//eslint-disable-line
          process.exit(1);
        }
      });
    },
  ],
};
