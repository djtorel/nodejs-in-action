const express = require('express');
const app = express();

const host = 'localhost';
const port = 3030;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Express web app on http://${host}:${port}/`);
});