/*
 * @Description: 
 * @Author: 胡阳阳
 * @Date: 2019-11-18 20:52:44
 * @LastEditTime: 2019-12-05 08:30:03
 * @LastEditors: 胡阳阳
 */

if (typeof window === "undefined") {
    global.window = {};
}

const express = require("express");
const { renderToString } = require("react-dom/server");
const SSR = require("../dist/search-server")
const fs = require("fs");
const path = require("path");
//  同步读取文件二进制流 并且转换为字符串
const template = fs.readFileSync(path.join(__dirname, "../dist/search.html"), "utf-8")



const renderMarkup = (str) => {
    console.log("template", template);
    return template.replace("<!-- HTML_PLACEHOLDER -->", str);

}
const server = (port) => {
    const app = express()
    app.use(express.static("dist"))
    app.get("/search", (req, res) => {
        res.set('Content-Type', 'text/html')
        let html = renderMarkup(renderToString(SSR))
        console.log("html", html)
        res.status(200).send(html)
    })
    app.listen(port, () => {
        console.log("Server is running...")
    })
}
server(process.env.PORT || 3000)