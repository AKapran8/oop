// const path = require('path');
// const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/app.js',
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, 'assets', 'scripts'),
		publicPath: 'assets/scripts/'
	},
	plugins: [
		new CleanPlugin.CleanWebpackPlugin()
	]

	// devtool: 'source-map'
	// devServer: {
	// 	contentBase: './'
	// }
}
