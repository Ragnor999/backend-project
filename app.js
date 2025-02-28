// Require module
const express = require('express');

// create express object
const app = express();

// handling GET request
app.get('/',( req, res) => {
    res.send('Hello World, node app is running on this server');
    res.end();
})

// port number
const PORT = process.env.PORT || 5000;

// server setup
app.listen(PORT, console.log(
    `server started on port ${PORT}`
));

// this sums up building of our first microservice





























