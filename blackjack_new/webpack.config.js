const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: ['@babel/polyfill', './src/main.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: `js/bundle.[contenthash].js`,
        clean: true, // Заменяет CleanWebpackPlugin в webpack 5
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        // Заменяем WebpackSynchronizableShellPlugin на webpack hooks
        {
            apply: (compiler) => {
                compiler.hooks.beforeRun.tapAsync('PrebuildScript', (compilation, callback) => {
                    const { execSync } = require('child_process');
                    try {
                        execSync('node ./tools/prebuild/createAudiosprite', { stdio: 'inherit' });
                        callback();
                    } catch (error) {
                        callback(error);
                    }
                });
                
                compiler.hooks.afterEmit.tapAsync('PostbuildScript', (compilation, callback) => {
                    const { execSync } = require('child_process');
                    try {
                        execSync('node ./tools/postbuild/cacheBuster', { stdio: 'inherit' });
                        callback();
                    } catch (error) {
                        callback(error);
                    }
                });
            }
        },
        new CopyPlugin({
            patterns: [{ from: './assets/live', to: './assets' }],
        }),
        new HtmlWebpackPlugin({
            template: './templates/index.html',
            cache: false,
        }),
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //         {
        //             module: 'fapi',
        //             entry: '//api.ok.ru/js/fapi5.js',
        //             global: 'FAPI',
        //         },
        //     ],
        // }),
    ],
    optimization: {
        // Заменяем LimitChunkCountPlugin на optimization
        splitChunks: {
            cacheGroups: {
                default: false,
            },
        },
        runtimeChunk: false,
    },
};
