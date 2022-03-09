// Perform imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');


// Set constants
const C = require('./constants.js');


// Create and configure MongoDB connection
const MongoClient = require('mongodb').MongoClient;
const url = C.MONGODB_URI;
const client = new MongoClient(url);
client.connect();


// Create and configure express app
const app = express();
app.set('port', C.PORT);
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


// Configure API routes
const userRouter = require('./api/routes/user');
app.use('/api/user', userRouter);


// Begin listening on relevant port
app.listen(C.PORT, () =>
{
    console.log('Server listening on port ' + C.PORT);
});