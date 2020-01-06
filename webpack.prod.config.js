/*
 * @Description:
 * @Author: 胡阳阳
 * @Date: 2019-10-28 19:17:45
 * @LastEditTime : 2020-01-06 20:16:38
 * @LastEditors  : 胡阳阳
 */
const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
// 速度分析
const NotifierPlugin = require('friendly-errors-webpack-plugin');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
// 体积分析
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// css 擦除
const PurgecssPlugin = require('purgecss-webpack-plugin')

const PATHS = {
  src: path.join(__dirname,"src")
}
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require("webpack")
const smp = new SpeedMeasurePlugin();
const vendor = [ 
  'react',
  'react-dom',
];
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
//获取cpu数
const  cpuNum = require('os').cpus().length
//  读取入口文件
const setMPA = () => {
  const entryFiles = glob.sync(path.resolve(__dirname, './src/*/index.js'));
  const entry = {};
  const htmlWebpackPlugins = [];
  entryFiles.forEach((file) => {
    const entryArr = file.match(/src\/(.*)\/index.js/);
    const entryName = entryArr[1];
    const entryPath = entryArr[0];
    entry[entryName] = `./${entryPath}`;
    htmlWebpackPlugins.push(new HtmlWebpackPlugin({
      template: path.join(__dirname, entryPath.replace(/index.js/, 'index.html')),
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
  entry.vendor = vendor;
  return {
    entry,
    htmlWebpackPlugins,
  };
};
const { entry, htmlWebpackPlugins } = setMPA();
module.exports = smp.wrap({
  mode: 'none',
  // mode: "production",
  entry,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js',
  },
  devServer: {
    contentBase: './dist/index.html',
    hot: true,
  },
  plugins: [
    // 生成css文件指纹
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    // 体积分析
    new BundleAnalyzerPlugin(),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'), // css 预处理器
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
    new NotifierPlugin(),
    // 引用dll plugins
    new webpack.DllReferencePlugin({
      manifest: require("./dll/library.json")
    }),
    // 模块缓存
    new HardSourceWebpackPlugin(),
    // css擦出无用代码
    new PurgecssPlugin({
      paths: () => glob.sync(`${PATHS.src}/**/*`, { nodir: true })
    }),
    ...htmlWebpackPlugins,
    // 主动触发并捕获错误
    function () {
      //  this为compiler 对象
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1) {
          console.log('build error');
          process.exit(1);
        }
      });
    },
  ],
  optimization: {
    minimizer: [
      // 多进程压缩js
      new TerserPlugin({
        parallel: true,
        cache: true
      }),
    ],
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
      },
    },
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        // use: ["babel-loader","eslint-loader"],
        use: [
          {
            // 多进程打包
            loader: "thread-loader",
            options: {
              workers: cpuNum ? cpuNum -1 : 1
            }
          }, 'babel-loader?cacheDirectory=true'],
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
                require('autoprefixer')({
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
  devtool: 'inline-source-map',
  stats: 'errors-only',
});
