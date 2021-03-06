'use strict'

var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var options = {
  debug: false,
  entry: [
    './app/react.tsx',
    './app/style.scss',
  ],
  contentBase: "./app",
  resolve: {
    extensions: ['', '.js', '.ts', '.tsx', '.json'],
  },
  output: {
    path: __dirname + '/www/',
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { test: /\.js$/, loader: "source-map-loader" }
    ],
    loaders: [
      { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/, loader : 'file-loader' },
      { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.tsx$/, loaders: ['react-hot-loader/webpack', 'awesome-typescript-loader'], exclude: /node_modules/ },
    ],
    postLoaders: [
      { test: /\.tsx$/, loaders: ['babel'], exclude: /node_modules/ },
    ],
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    //new webpack.optimize.UglifyJsPlugin({minimize: true, mangle: false}),
    new webpack.optimize.CommonsChunkPlugin('init.js'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new CopyWebpackPlugin([
        { from: 'app/images', to: 'images'},
        { from: 'app/quests', to: 'quests'},
        { from: 'app/scripts', to: 'scripts' },
        { from: 'app/fonts', to: 'fonts'},
        { from: 'app/index.html' },
        { from: 'app/theme.css' },
    ]),
  ],
};

module.exports = options;
