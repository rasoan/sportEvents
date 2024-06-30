'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const webpackConfig = {
    mode: "development",
    entry: {
        index: './src/index.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        // clean: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "ts-loader",
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
        ]
    },
    devServer: {
        hot: true,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            chunks: [ 'index' ],
        })
    ],
};

module.exports = () => {
    return new Promise((resolve) => {
        resolve(webpackConfig);
    }).then(response => {
        return response;
    });
}
