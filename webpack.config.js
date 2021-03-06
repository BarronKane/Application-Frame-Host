const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { unstable_batchedUpdates } = require('react-dom');

module.exports = (env, argv) => {
    const isProduction = argv.mode == 'production';
    console.log("PRODUCTION: ", isProduction);

    return {
        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].css"
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: './ui/resources' }
                ]
            })
            //new HtmlWebpackPlugin({
            //    template: './ui/index.html',
            //    inject: 'head',
            //    favicon: './ui/resources/favicon.ico'
            //}),
        ],
        entry: {
            bundle: './ui/index.js',
            style: './ui/index.scss'
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'resources', 'app'),
            publicPath: ""
        },
        resolve: {
            alias: {
                Utilities: path.resolve('ui/js/')
            },
            extensions: ['.js', '.json', '.jsx']
        },
        devtool: (isProduction) ? false : "source-map",
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                [
                                    '@babel/preset-react', {
                                        development: !isProduction
                                    }
                                ]
                            ]
                        }
                    }
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                "sourceMap": !isProduction,
                            },
                        },
                        "resolve-url-loader",
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                            }
                        }
                    ]
                },
                {
                    test: /\.html$/i,
                    loader: 'html-loader',
                    options: {

                    }
                },
                {
                    test: /\.html$/i,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    }
                },
                {
                    test: /(\.(png|jpe?g|gif|ico)$|^((?!font).)*\.svg$)/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    }
                },
                {
                    test: /(\.(woff2?|ttf|eot|otf)$|font.*\.svg$)/,
                    type: 'asset/resource',
                }            
            ]
        },
        optimization: {
            minimize: isProduction,
            minimizer: [
                (isProduction) ?
                new CssMinimizerPlugin({
                    parallel: true,
                    minimizerOptions: {
                        preset: [
                            'default',
                            {
                                discardComments: { removeAll: true },
                            },
                        ]
                    }
                
            }) : () => {},
                (isProduction) ?
                new TerserPlugin({
                    parallel: true,
                    terserOptions: {
                        format: {
                            comments: false,
                        },
                    },
                    extractComments: false,
                }) : () => {}
            ]
        },
        devServer: {
            contentBase: path.join(__dirname, 'resources', 'app'),
            port: 8080,
        }
    }
}
