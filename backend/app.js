const express = require('express');
const path = require('path')
const app = express();
const port = 3000

app.get('/api', (req, res) => {
    res.send('Test function!')
});

app.listen(port, () => {
    console.log('Listening on port ${port}');
});