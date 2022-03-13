// Perform imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Set constants
const C = require('./constants.js');

// Create and configure MongoDB connection with mongoose
const mongoose = require('mongoose');
mongoose.connect(C.MONGODB_URI, {useNewUrlParser:true, useUnifiedTopology:true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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


// Configure paths for static files
if(process.env.NODE_ENV === 'production')
{
    app.use(express.static('frontend/build'));
    app.get('*', (req, res) =>
    {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

// Begin listening on relevant port
app.listen(C.PORT, () =>
{
    console.log('Server listening on port ' + C.PORT);
});
