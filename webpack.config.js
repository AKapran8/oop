const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/app.js',
	output: {
		filename: '[contenthash].js',
		path: path.resolve(__dirname, 'assets', 'scripts'),
		publicPath: 'assets/scripts/'
	},
	devtool: 'eval-cheap-module-source-map',
	plugins: [
		new CleanPlugin.CleanWebpackPlugin()
	]
	// devServer: {
	// 	contentBase: './'
	// }
}
