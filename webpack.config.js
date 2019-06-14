/* eslint no-console: 0 */
/* global process */
/* global __dirname */

const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const extractGlobalCSS = new ExtractTextPlugin('css/[name]-global-styles.css');
const extractModuleCSS = new ExtractTextPlugin('css/[name]-module-styles.css');
const TARGET = process.env.npm_lifecycle_event.toLowerCase().split(':')[0];
const TARGET_MODIFIER = process.env.npm_lifecycle_event.toLowerCase().split(':')[1];
const OUTPUT_DIR = path.join(__dirname, 'dist');
const SOURCE_DIR = path.join(__dirname, 'src');

console.log(`environment event is... ${TARGET}`);
console.log(`current directory is... ${__dirname}`);
console.log(`output directory is... ${OUTPUT_DIR}`);
console.log(`source directory is... ${SOURCE_DIR}`);

if (TARGET_MODIFIER) {
    console.log(`target modifier is... ${TARGET_MODIFIER}`);
}

const { env } = process;

const common = {
	mode: env.NODE_ENV,
	entry: {
        index: ['babel-polyfill', './src/index.jsx'],
    },
	output: {
		path: OUTPUT_DIR,
		filename: 'scripts/bundle-[name].js'
	},
	resolve: {
		extensions: ['.jsx', '.js'],
	},
	module: {
		rules: [
			{
                test: /\.jsx$/,
                include: [SOURCE_DIR],
				use: 'babel-loader',
				exclude: /node_modules/
            },
			{
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader?name=[name].[ext]&outputPath=fonts/'],
			},
			{
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
		]
	},
	plugins: [
		new webpack.DefinePlugin({ 
			'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV) 
		}),
		new webpack.ProvidePlugin({
            _: 'lodash',
        }),
		new HtmlWebpackPlugin()
	]
};


if (TARGET === 'dev') {
    module.exports = merge.smart(common, {
        output: {
            publicPath: '/',
        },
        devtool: 'inline-source-map',
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    exclude: path.join(__dirname, 'src/components'),
                    use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
                },
                {
                    test: /\.scss$/,
                    include: path.join(__dirname, 'src/components'),
                    use: [
                        {
                            loader: 'style-loader',
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[name]__[local]___[hash:base64:5]',
                            },
                        },
                        {
                            loader: 'postcss-loader',
                        },
                        {
                            loader: 'sass-loader',
                        },
                    ],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|pdf|mp4)$/,
                    use: ['file-loader?name=[name].[ext]&outputPath=images/'],
                },
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                DEVELOPMENT: JSON.stringify(true),
            }),
            new HtmlWebpackPlugin({
                dev: true,
                template: 'templates/index.html',
                filename: 'index.html',
                chunks: ['index'],
                hash: true,
            })
        ],
        devServer: {
            contentBase: OUTPUT_DIR,
            hot: true,
            publicPath: '/',
        },
    });
} else {
    let plugins = [
        extractGlobalCSS,
        extractModuleCSS,
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                warnings: false,
                output: {
                    comments: false,
                },
                compress: {
                    drop_console: true,
                },
            },
        }),
    ];
    
    module.exports = merge.smart(common, {
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    exclude: path.join(__dirname, 'src/components'),
                    use: extractGlobalCSS.extract({
                        fallback: 'style-loader', 
                        use: ['css-loader', 'postcss-loader', 'sass-loader'],
                    }),
                },
                {
                    test: /\.scss$/,
                    include: path.join(__dirname, 'src/components'),
                    use: extractModuleCSS.extract({
                        fallback: 'style-loader', 
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: true,
                                    importLoaders: 1,
                                    localIdentName: '[name]__[local]___[hash:base64:5]',
                                },
                            },
                            {
                                loader: 'postcss-loader',
                            },
                            {
                                loader: 'sass-loader',
                            },
                        ],
                    }),
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|pdf|mp4)$/,
                    use: ['file-loader?name=[name].[ext]&outputPath=/images/'],
                },
            ],
        },
        plugins,
    });
}
