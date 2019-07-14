import * as path from 'path';
import * as webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import * as HTMLWebpackPlugin from 'html-webpack-plugin';
import * as CopyWebpackPlugn from 'copy-webpack-plugin';
import * as extractCSS from 'mini-css-extract-plugin';
import { VueLoaderPlugin } from 'vue-loader';

const packageJSON = require('./package.json');
const devConfig = packageJSON.devConfig;
const vendors = packageJSON.vendors;
const outDir = packageJSON.outDir;

const tsLoaderRules: Array<webpack.Rule> = [
    {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
            loaders: {
                'scss': 'vue-style-loader!css-loader!sass-loader',
                'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
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

const sassLoaderRules: Array<webpack.Rule> = [
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

const sassLoaderProdRules: Array<webpack.Rule> = [
    {
        test: /\.(sc|c)ss$/,
        use: [
            extractCSS.loader,
            'css-loader',
            'sass-loader'
        ]
    }
];

const otherLoaderRules: Array<webpack.Rule> = [
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

const optimizationConfig: webpack.Options.Optimization = {
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

let config: webpack.Configuration = {
    entry: {
        vendor: vendors,
        polyfill: '@babel/polyfill',
        main: './src/main.ts'
    },
    output: {
        path: (outDir || `${__dirname}/dist`),
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
        rules: [
            ...tsLoaderRules,
            ...otherLoaderRules
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        host: devConfig.host,
        port: devConfig.port
    },
    plugins: [
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
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

module.exports = (env: any) => {
    config.mode = env.mode;
    if (env.mode == "production") {
        config.devtool = false;
        config.resolve!.alias!.vue = 'vue/dist/vue.min.js';
        config.module!.rules.push(...sassLoaderProdRules);
        config.plugins!.push(
            new extractCSS({
                filename: '[name].[hash].css',
                chunkFilename: '[name].[hash].css'
            })
        );
        config.plugins!.push(
            new webpack.NormalModuleReplacementPlugin(
				/\/main.routes/,
				'./main.routes.prod.ts',
            )
        );
    } else {
        config.module!.rules.push(...sassLoaderRules);
    }
    config.plugins!.push(
        new HTMLWebpackPlugin({
            template: 'index.html',
            minify: false
        })
    );
    return config;
}