const express = require('express');

const app = express();

const port = process.env.PORT || 5959;

// Compatability
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Controll-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/', require('./routes/index.js'));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});