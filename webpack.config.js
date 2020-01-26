const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		port: 9000
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: './src/index.html'
		})
	],
	module: {
		rules: [{
			test: /\.html$/,
			use: [{
				loader: 'html-loader',
				options: {
					minimize: false
				}
			}]
		}, {
			test: /\.css$/,
			use: [
				'style-loader',
				'css-loader'
			]
		}]
	}
};
