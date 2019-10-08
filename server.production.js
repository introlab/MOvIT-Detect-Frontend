const path = require('path');
const express = require('express');

const app = express(),
            STATIC_DIR = __dirname,
            HTML_FILE = path.join(STATIC_DIR, 'index.html')


app.use(express.static(STATIC_DIR))

app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
})

const port = process.env.PORT || 80
app.listen(port, () => {
    console.log(`App listening to ${port}....`)
})