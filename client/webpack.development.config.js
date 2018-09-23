const CopyWebpackPlugin = require('copy-webpack-plugin');

var path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            require('@babel/preset-react'),
                            require('@babel/preset-env')
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            },
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'public' }
        ])
    ],
    stats: {
        colors: true
    },
    devtool: 'source-map',
    watch: true
};
