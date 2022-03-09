// Perform imports
const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Set constants
const PORT = process.env.PORT || 5000;

// Create express app
const app = express();
app.set('port', (process.env.PORT || 5000));
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => 
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

if(process.env.NODE_ENV === 'production')
{
    app.use(express.static('frontend/build'));
    app.get('*', (req, res) =>
    {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

app.listen(PORT, () =>
{
    console.log('Server listening on port ' + PORT);
});

