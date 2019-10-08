const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

const port = process.env.PORT || 80;
const host = process.env.HOST || `192.168.10.1`; /*process.env.NODE_ENV === 'demo' ? 'movit-plus.herokuapp.com' : '0.0.0.0';*/

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
  console.log(`Listening at ${host}:${port}`);
});
