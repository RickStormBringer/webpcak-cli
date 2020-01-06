/*
 * @Description: 
 * @Author: 胡阳阳
 * @Date: 2019-11-11 17:45:08
 * @LastEditTime: 2019-12-10 19:53:45
 * @LastEditors: 胡阳阳
 */
module.exports = {
    "parser": "babel-eslint",
    // 继承 airbnb 的代码规范
    "extends": "airbnb-base",
    // 指定运行环境 这样对应环境的全局变量就不会出错
    "env": {
        "browser": true,
        "node": true
    }
} 