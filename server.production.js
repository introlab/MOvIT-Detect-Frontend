/**
 * EXPRESS PRODUCTION SERVER config
 * Uses the previously compiled code to load and launch a server listening on the mentionned
 * port and hosts
 */

const path = require('path');
const express = require('express');

const port = process.env.PORT || 80
const host = process.env.HOST || '192.168.10.1'

const app = express(),
  STATIC_DIR = __dirname,
  HTML_FILE = path.join(STATIC_DIR, 'index.html')

app.use(express.static(STATIC_DIR))

app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
})

app.listen(port, host, () => {
    console.log(`Express server listening at ${host}:${port}`);
})