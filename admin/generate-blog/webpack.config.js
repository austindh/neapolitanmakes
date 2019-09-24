const path = require('path');

const INPUT_FILES_PATH = path.resolve(__dirname, './js');

module.exports = {
	entry: {
		main: path.join(INPUT_FILES_PATH, 'main.ts'),
		sidenav: path.join(INPUT_FILES_PATH, 'sidenav.ts'),
		tagSearch: path.join(INPUT_FILES_PATH, 'tagSearch.ts')
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, '../../docs/js')
	},
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	mode: 'production'
};
