const path = require('path');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const webpack = require('webpack');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: {
		// app:  './public/app.jsx',
		main: './src/client/client.js',
	},
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, './src/public/bundle')
		// filename: 'bundle.js',
		// path: path.resolve(__dirname, './public/script')
	},
	module: {
		rules: [
			{
				test: /\.s?css$/,
				use: { loader: 'css-loader', /*options: { minimize: env.NODE_ENV === 'production' } */},
						// { loader: 'postcss-loader', options: { sourceMap: true } },
						// 'resolve-url-loader',
						// { loader: 'sass-loader', options: { sourceMap: true } }
					
				
			},
			{
				test: /\.jsx?$/, 
				use: ['babel-loader'], 
				// exclude: [nodeModulesPath],
				exclude: /node_modules(\/|\\)(?!(@feathersjs))/,
			},
			// {
			// 	test: /\.s?css$/,
			// 	loader: ExtractTextPlugin.extract({
			// 		fallback: {loader: "style-loader"},
			// 		loader: 'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader'
			// 	})
			// },
			{
				test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
				loader: 'url-loader?limit=100000' 
			}
		]
	},
	plugins: [
		// new ExtractTextPlugin({filename: 'b[name].css', allChunks: true }),
		// new webpack.optimize.OccurenceOrderPlugin(),
		// new webpack.optimize.CommonsChunkPlugin({
		//  name: 'vendor',
		//  filename: 'vendor.bundle.js',
		//  minChunks: Infinity
		// }),
		// new ExtractTextPlugin("style.css"),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.DefinePlugin({
			'typeof window': "\"object\"",
			'process.env.NODE_ENV': JSON.stringify('development')
		})
	],
	node: {
		fs: "empty"
	},
	resolve: {
		alias: {
			lib: path.resolve(__dirname, 'lib')
		}
	}
}