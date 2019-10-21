/**
 * WEBPACK DEV SERVER config
 * Uses Webpack to compile the code for developpement and launches it using a
 * webpack dev server. Uses the "webpack.config.js" file.
 */

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

const port = process.env.PORT || 80;
const host = process.env.HOST || `192.168.10.1`;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  compress: true,
  disableHostCheck: true,
}).listen(port, host, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`WebpackDevServer listening at ${host}:${port}`);
});
