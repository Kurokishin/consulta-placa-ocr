require('dotenv').config();
const homepageRoute = require('express').Router();
const path = require('path');

homepageRoute.get('/', (req, res) => {
    // Use the `res.sendFile` method to send the HTML file
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
    //app.use(express.static(path.join(__dirname, 'src/public')));
});

module.exports = homepageRoute;