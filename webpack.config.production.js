/**
 * WEBPACK CONFIG
 *
 * Notes on config properties:
 *
 * 'entry'
 * Entry point for the bundle.
 *
 * 'output'
 * If you pass an array - the modules are loaded on startup. The last one is exported.
 *
 * 'resolve'
 * Array of file extensions used to resolve modules.
 *
 * 'webpack-dev-server'
 * Is a little node.js Express server, which uses the webpack-dev-middleware to
 * serve a webpack bundle. It also has a little runtime which is connected to
 * the server via Socket.IO.
 *
 * 'webpack/hot/dev-server'
 * By adding a script to your index.html file and a special entry point in your
 * configuration you will be able to get live reloads when doing changes to your
 * files.
 *
 * devtool: 'eval-source-map'
 * http://www.cnblogs.com/Answer1215/p/4312265.html
 * The source map file will only be downloaded if you have source maps enabled
 * and your dev tools open.
 *
 * HotModuleReplacementPlugin()
 * Hot Module Replacement (HMR) exchanges, adds or removes modules while an
 * application is running without page reload.
 *
 * NoErrorsPlugin()
 * Hot loader is better when used with NoErrorsPlugin and hot/only-dev-server
 * since it eliminates page reloads altogether and recovers after syntax errors.
 *
 * 'react-hot'
 * React Hot Loader is a plugin for Webpack that allows instantaneous live
 * refresh without losing state while editing React components.
 *
 * 'babel'
 * Babel enables the use of ES6 today by transpiling your ES6 JavaScript into equivalent ES5 source
 * that is actually delivered to the end user browser.
 */

const webpack = require('webpack');
const path = require('path');
require('babel-polyfill');

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

/*var OnlyIfChangedPlugin = require('only-if-changed-webpack-plugin');
var opts = {
  rootDir: process.cwd(),

  devBuild: process.env.NODE_ENV !== 'production',
};*/

const MomentLocalesPlugin = require('moment-locales-webpack-plugin'); //Empêche le chargement de langues de traduction inutiles

//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//-------------------------------------------------------------------------------------




module.exports = smp.wrap({
  mode: 'production',
  //devtool: 'source-map',
  entry: [
    'babel-polyfill',
    './src/index',
  ],
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        PORT: JSON.stringify(process.env.PORT),
      },
    }),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: [ 'cache-loader','babel-loader'],
        /*options: {
          cacheDirectory: false
        },*/
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.ya?ml$/,
        loader: 'json-loader!yaml-loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
      },
      {
        test: /\.(css|scss)$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
  optimization: {
    minimize: false
  },

  plugins: [
    //new BundleAnalyzerPlugin(),
    new MomentLocalesPlugin({
      localesToKeep: ['fr-ca'] //garde uniquement l'anglais et le francçais comme langues de traduction
    }),
  ]
  
  /*plugins: [
    new OnlyIfChangedPlugin({
      cacheDirectory: path.join(opts.rootDir, 'tmp/cache'),
      cacheIdentifier: opts, // all variable opts/environment should be used in cache key
    })
  ],*/
});