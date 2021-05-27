/**
 * WEBPACK DEV SERVER CONFIG
 * Uses Webpack to bundle the code for developpement and launches it using a
 * webpack dev server. Uses the "webpack.config.js" file.
 */

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config'); // Configuration file for webpack
const { createProxyMiddleware } = require('http-proxy-middleware');

const port = process.env.PORT || 3000;
const host = process.env.HOST || `0.0.0.0`;

app = new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  compress: true,
  disableHostCheck: true,
})

//Proxy /api calls to node-red backend
app.use('/api', createProxyMiddleware({
	target: 'http://192.168.0.108:1880',
	changeOrigin: true,
	ws: true,
	pathRewrite: {
		'/api': '/',
		'/ws': '/ws'
	},
	}));


app.listen(port, host, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`WebpackDevServer listening at ${host}:${port}`);
});
