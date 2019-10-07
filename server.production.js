/*const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config.production');

const port = process.env.PORT || 3000;
const host = process.env.host || '0.0.0.0'; //Should be tested on RPi

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: false,
  historyApiFallback: true,
  compress: true,
  disableHostCheck: true,
}).listen(port, host, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Listening at localhost:${port}`);
});*/


const path = require('path');
const express = require('express');

const app = express(),
            STATIC_DIR = __dirname,
            HTML_FILE = path.join(STATIC_DIR, 'index.html')


app.use(express.static(STATIC_DIR))

app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})