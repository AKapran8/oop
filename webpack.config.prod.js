const prodPath = require('path');

module.exports = {
	mode: 'development',
	entry: './src/app.js',
	output: {
		filename: 'app.js',
		path: prodPath.resolve(__dirname, 'assets', 'scripts'),
		publicPath: 'assets/scripts/'
	},

	// devtool: 'source-map'
	// devServer: {
	// 	contentBase: './'
	// }
}
