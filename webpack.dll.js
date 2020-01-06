let path = require("path");
const webpack = require("webpack")

module.exports = {
    context: process.cwd(),
    entry: {
        library: [
            "react",
            "react-dom"
        ]
    },
    output: {
        filename: '[name]_[chunkhash:8].dll.js',
        path: path.join(__dirname, "./dll"),
        library: "[name]"
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]',
            path: path.join(__dirname, "./dll/[name].json")
        })
    ]
}