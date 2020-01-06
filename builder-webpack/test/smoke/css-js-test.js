/*
 * @Description:
 * @Author: 胡阳阳
 * @Date: 2019-12-11 20:48:34
 * @LastEditTime: 2019-12-12 07:27:00
 * @LastEditors: 胡阳阳
 */

const glob = require('glob-all');

describe(
  'checking css js files',
  () => {
    it('should be generate files', (done) => {
      const files = glob.sync([
        './dist/index_*.js',
        './dist/index_*.css',
        './dist/search_*.js',
        './dist/search_*.css',
      ]);
      if (files.length > 0) {
        done();
      } else {
        throw new Error('no html');
      }
    });
  },
);
