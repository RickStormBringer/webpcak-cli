/*
 * @Description: 
 * @Author: 胡阳阳
 * @Date: 2019-10-28 19:20:50
 * @LastEditTime: 2019-11-07 17:14:35
 * @LastEditors: 胡阳阳
 */
import {helloWebpack} from './helloword';
import commonFunc from "../common/common.js"
const hello = helloWebpack();

commonFunc()

document.write(hello)