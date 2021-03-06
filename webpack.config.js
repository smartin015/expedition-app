'use strict'

var webpack = require('webpack')
var DashboardPlugin = require('webpack-dashboard/plugin');

var options = {
  cache: true,
  debug: true,
  entry: [
    'webpack-dev-server/client?http://localhost:5000',
    'webpack/hot/only-dev-server',
    './app/react.tsx',
    './app/style.scss',
  ],
  resolve: {
    extensions: ['', '.js', '.ts', '.tsx', '.json']
  },
  contentBase: "./app",
  output: {
    path: __dirname + '/dist/',
    publicPath: 'http://0.0.0.0:5000/',
    filename: 'bundle.js'
  },
  stats: {
    colors: true,
    reasons: true
  },
  module: {
    preLoaders: [
      { test: /\.js$/, loader: "source-map-loader" }
    ],
    loaders: [
      { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/, loader : 'file-loader' },
      { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.tsx$/, loaders: ['react-hot-loader/webpack', 'awesome-typescript-loader'], exclude: /node_modules/ },
    ],
    postLoaders: [
      { test: /\.tsx$/, loaders: ['babel'], exclude: /node_modules/ },
    ],
  },
  plugins: [
    new DashboardPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin('init.js')
  ]
}

module.exports = options
