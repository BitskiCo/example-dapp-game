const webpack = require('webpack');
const path = require('path');

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	devtool: 'source-map',
	entry: './app/index.js',

	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [{
				test: [/\.vert$/, /\.frag$/],
				use: 'raw-loader'
			}, {
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',

				options: {
					presets: ['env']
				}
			}
		]
	},

	plugins: [
		new HTMLWebpackPlugin({
			title: 'Example Dapp',
			template: './app/index.html',
			hash: true
		}),
		new HTMLWebpackPlugin({
			title: 'Example Dapp',
			filename: 'callback.html',
			template: './app/callback.html',
			hash: true
		}),
		new CopyWebpackPlugin([
			{
				from: 'assets',
				to: 'assets'
			}, {
			from: 'public',
				to: 'public'
			}
		]),
		new webpack.DefinePlugin({
			'CANVAS_RENDERER': JSON.stringify(true),
			'WEBGL_RENDERER': JSON.stringify(true)
		})
	]
};
