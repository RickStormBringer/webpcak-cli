/*
 * @Description:
 * @Author: 胡阳阳
 * @Date: 2019-12-10 20:45:46
 * @LastEditTime: 2019-12-12 07:30:23
 * @LastEditors: 胡阳阳
 */
const webpack = require('webpack');
const path = require('path');
// 删除文件
const rimraf = require('rimraf');
const Mocha = require('mocha');

const mocha = new Mocha({
  timeout: '10000ms',
});
// cd 进template 文件夹
process.chdir(path.join(__dirname, 'template'));

rimraf('./dist', () => {
  // eslint-disable-next-line global-require
  const prodConfig = require('../../lib/webpack.prod');
  webpack(prodConfig, (err, stats) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      process.exit(2);
    }
    console.log(stats.toString({
      colors: true,
      modules: false,
      children: false,
    }));

    // 测试 是否生成制定的html js 和 css
    console.log('start testing...');
    mocha.addFile(path.join(__dirname, 'css-js-test.js'));
    mocha.addFile(path.join(__dirname, 'html-test.js'));
    mocha.run();
  });
});
