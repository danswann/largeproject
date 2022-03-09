// Perform imports
const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');


// Set constants
const PORT = process.env.PORT || 5000;


// Create and configure MongoDB connection
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
client.connect();


// Create and configure express app
const app = express();
app.set('port', (process.env.PORT || 5000));
app.use(cors());
app.use(bodyParser.json());


// Customizer headers
app.use((req, res, next) => 
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});


// Configure paths for static files
if(process.env.NODE_ENV === 'production')
{
    app.use(express.static('frontend/build'));
    app.get('*', (req, res) =>
    {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}


// Configure API
var apiMain = require('./api/main.js');
apiMain.setApp(app, client);


// Begin listening on relevant port
app.listen(PORT, () =>
{
    console.log('Server listening on port ' + PORT);
});