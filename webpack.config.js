const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => {

  const entry = './src/main.js';

  const output = {
    path: Path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  };

  const module = {rules: [
    { test: /\.js?$/, loader: 'babel-loader' },
    { test: /\.styl?$/, loader: 'stylus-loader' }
  ]};

  const performance = {
    hints: "warning", // enum
    maxAssetSize: 200000, // int (in bytes),
    maxEntrypointSize: 400000, // int (in bytes)
    assetFilter: assetFilename => { // Function predicate that provides asset filenames
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  };

  const devtool = "source-map";

  const stats = "errors-only";

  // const devServer = {
  //   proxy: { // proxy URLs to backend development server
  //     '/api': 'http://localhost:3000'
  //   },
  //   contentBase: Path.join(__dirname, 'public'), // boolean | string | array, static file location
  //   compress: true, // enable gzip compression
  //   historyApiFallback: true, // true for index.html upon 404, object for multiple paths
  //   hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
  //   https: false, // true for self-signed, object for cert authority
  //   noInfo: true, // only errors & warns on hot reload
  // };

  const plugins = [
    new HtmlWebpackPlugin({  // Also generate a test.html
      // filename: 'test.html',
      template: 'src/index.html'
    })
  ];

  return { entry, output, module, devtool, stats, plugins };
};