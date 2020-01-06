/*
 * @Description:
 * @Author: 胡阳阳
 * @Date: 2019-12-12 07:55:36
 * @LastEditTime: 2019-12-12 08:15:44
 * @LastEditors: 胡阳阳
 */
const path = require('path');

process.chdir(path.join(__dirname, 'smoke/template'));
describe('bulder webpack base test', () => {
  require('./unit/webpack-base-test');
});
