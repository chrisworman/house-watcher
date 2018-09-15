const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// define a simple route
app.get('/houses', (req, res) => {
    res.json([{"id": "houseid"}]);
});

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
