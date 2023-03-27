const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtract = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const PostCSSPlugins = [
    require('postcss-nested'),
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('autoprefixer')
];

const currentTask = process.env.npm_lifecycle_event;

module.exports = {
    mode: "development",
    entry: {
        app: './app/scripts/App.js'
    },
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({filename: 'index.html', template: './app/index.html'}),
        new MiniCssExtract({filename: 'styles.[contenthash].css'})
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    currentTask == "build" ? MiniCssExtract.loader : 'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: PostCSSPlugins
                            }
                        }
                    }
                ]
            }
        ]
    },
    devServer: {
        watchFiles: ['./app/**/*.html'],
        static: {
            directory: path.resolve(__dirname, 'docs')
        },
        port: 3000,
        hot: true
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 1000
        },
        minimize: true,
        minimizer: [`...`, new CssMinimizerPlugin()]
    }
}