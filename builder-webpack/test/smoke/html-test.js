/*
 * @Description:
 * @Author: 胡阳阳
 * @Date: 2019-12-11 20:48:34
 * @LastEditTime: 2019-12-12 07:27:12
 * @LastEditors: 胡阳阳
 */

const glob = require('glob-all');

describe(
  'checking  html files',
  () => {
    it('should be generate files', (done) => {
      const files = glob.sync([
        './dist/index.html',
        './dist/search.html',
      ]);
      if (files.length > 0) {
        done();
      } else {
        throw new Error('no html');
      }
    });
  },
);
