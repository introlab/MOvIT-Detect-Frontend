/**
 * WEBPACK CONFIG
 * Compiles the project and runs it with "hot-reload" enabled in order to make
 * develppement faster. This code will load slower than the prodution version on
 * the browser but will update the page whenever a new change is detected in the
 * source files. Webpack-dev-server is used with this configuration instead of Express
 */

const webpack = require('webpack');
const path = require('path');

// Plugin that keeps "moment.js" from loading useless translation languages
// "moment.js" may not be necessary in the first place
const MomentLocalesPlugin = require('moment-locales-webpack-plugin'); 

// Can help viualize what constitutes the "bundle.js" (helpful for optimisation)
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  // Uncomment "new BundleAnalyzerPlugin()" line in the plugins section too

// Plugin used to get an idea of what part of the project took the most time to build
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const port = process.env.PORT || 80
const host = process.env.HOST || '0.0.0.0'


module.exports = smp.wrap({
  mode: 'development',

  // Set inputs and source files for webpack
  entry: [
    'babel-polyfill',
    'webpack-dev-server/client?http://' + host + ':' + port,
    'webpack/hot/dev-server',
    './src/index',
  ],

  // Sets how webpack will output the bundled file
  output: {
    path: path.join(__dirname,'static'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },

  resolve: {
    extensions: ['.js'],
  },

  // Allows easy mapping to source files and corresponding lines when detecting errors on the browser
  devtool: 'eval-source-map',

  plugins: [
    // "webpack.DefinePlugin" makes global variables available within the rest of the code
    // This plugin works through a "search and replace" method, executed everytime the project is bundled
    // These lines will forward environment variables made available for webpack to the project's code
    // These environment variables are set through launch scripts in package.json when required 
    //      BHOST will default to HOST's value when unspecified
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'production',
        PORT: JSON.stringify(process.env.PORT) || '80',
        HOST: JSON.stringify(process.env.HOST) || '192.168.10.1',
        BPORT: JSON.stringify(process.env.BPORT) || '1880',
        BHOST: JSON.stringify(process.env.BHOST) || JSON.stringify(process.env.HOST) || '192.168.10.1'
      },
    }),

    // Plugin that ensures webpack will not emit files when compilation fails
        new webpack.NoEmitOnErrorsPlugin(),

    //new BundleAnalyzerPlugin(),
    new MomentLocalesPlugin({
      localesToKeep: ['fr-ca'] // Keeps only french and english as translation languages
    }),

    // Provides hot-reload functionnalities 
    new webpack.HotModuleReplacementPlugin(),
  ],

  // Node configuration
  // All settings are set to their default values except "global" which was causing problem with "Webpack.DefinePlugin"
  node: {
    console: false,
    global: false,
    process: true,
    __filename: 'mock',
    __dirname: 'mock',
    Buffer: true,
    setImmediate: true,
    fs: 'empty',
    child_process: 'empty'
  },

  // Defines how to read and bundle different files
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
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
});