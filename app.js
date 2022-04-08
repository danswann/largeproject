// Perform imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Set constants
const C = require('./constants.js');

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

// Configure API routes
const userRouter = require('./api/routes/user');
app.use('/api/user', userRouter);

const postRouter = require('./api/routes/post');
app.use('/api/post', postRouter);

const notificationRouter = require('./api/routes/notification');
app.use('/api/notification', notificationRouter);

const directMessageRouter = require('./api/routes/directMessage');
app.use('/api/directMessage', directMessageRouter);

const spotifyRouter = require('./api/routes/spotify');
app.use('/api/spotify', spotifyRouter);


// Configure paths for static files
if(process.env.NODE_ENV === 'production')
{
    app.use(express.static('frontend/build'));
    app.get('*', (req, res) =>
    {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

module.exports = app;