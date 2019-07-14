"use strict";
exports.__esModule = true;
var path = require("path");
var webpack = require("webpack");
var clean_webpack_plugin_1 = require("clean-webpack-plugin");
var HTMLWebpackPlugin = require("html-webpack-plugin");
var CopyWebpackPlugn = require("copy-webpack-plugin");
var extractCSS = require("mini-css-extract-plugin");
var vue_loader_1 = require("vue-loader");
var packageJSON = require('./package.json');
var devConfig = packageJSON.devConfig;
var vendors = packageJSON.vendors;
var outDir = packageJSON.outDir;
var tsLoaderRules = [
    {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
            loaders: {
                'scss': 'vue-style-loader!css-loader!sass-loader',
                'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
            }
        }
    },
    {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
            appendTsSuffixTo: [/\.vue$/]
        }
    },
    {
        test: /\.js?$/,
        loader: 'babel-loader'
    }
];
var sassLoaderRules = [
    {
        test: /\.scss$/,
        use: [
            "style-loader",
            "css-loader",
            "sass-loader"
        ]
    },
    {
        test: /\.css$/,
        use: [
            "style-loader",
            "css-loader"
        ]
    }
];
var sassLoaderProdRules = [
    {
        test: /\.(sc|c)ss$/,
        use: [
            extractCSS.loader,
            'css-loader',
            'sass-loader'
        ]
    }
];
var otherLoaderRules = [
    {
        test: /\.(png|gif|jpg|jpeg)$/,
        loader: 'file-loader'
    },
    {
        test: /\.(woff2?|ttf|otf|eot|svg)$/,
        loader: 'file-loader'
    },
    {
        test: /\.html$/,
        loader: 'html-loader'
    }
];
var optimizationConfig = {
    splitChunks: {
        chunks: 'all',
        cacheGroups: {
            vue: {
                test: /[\\/]node_modules[\\/]vue/,
                reuseExistingChunk: true,
                filename: "vue.min.js",
                priority: 10
            }
        }
    }
};
var config = {
    entry: {
        vendor: vendors,
        polyfill: '@babel/polyfill',
        main: './src/main.ts'
    },
    output: {
        path: (outDir || __dirname + "/dist"),
        filename: '[name].bundle.js',
        chunkFilename: '[name].[hash].js'
    },
    resolve: {
        extensions: [".vue", ".ts", ".tsx", ".js"],
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    module: {
        rules: tsLoaderRules.concat(otherLoaderRules)
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        host: devConfig.host,
        port: devConfig.port
    },
    plugins: [
        new vue_loader_1.VueLoaderPlugin(),
        new clean_webpack_plugin_1["default"](),
        new CopyWebpackPlugn([
            {
                from: './src/assets/images/',
                to: 'assets/images/'
            },
            {
                from: './src/assets/fonts/',
                to: 'assets/fonts/'
            },
            {
                from: './src/assets/scripts/',
                to: 'assets/scripts/'
            },
            {
                from: './src/assets/files/',
                to: 'assets/files/'
            }
        ])
    ],
    optimization: optimizationConfig
};
module.exports = function (env) {
    var _a, _b;
    config.mode = env.mode;
    if (env.mode == "production") {
        config.devtool = false;
        config.resolve.alias.vue = 'vue/dist/vue.min.js';
        (_a = config.module.rules).push.apply(_a, sassLoaderProdRules);
        config.plugins.push(new extractCSS({
            filename: '[name].[hash].css',
            chunkFilename: '[name].[hash].css'
        }));
        config.plugins.push(new webpack.NormalModuleReplacementPlugin(/\/main.routes/, './main.routes.prod.ts'));
    }
    else {
        (_b = config.module.rules).push.apply(_b, sassLoaderRules);
    }
    config.plugins.push(new HTMLWebpackPlugin({
        template: 'index.html',
        minify: false
    }));
    return config;
};
