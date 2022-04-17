const DirectMessage = require('../models/directMessage');

exports.chat = async function(ws, req) {
    // Runs once on connection, setting userID and chatID of this connection
    ws.userID = req.query.userID;
    ws.chatID = req.query.chatID;
    // Whenever a chat is received
    ws.on('message', function(msg) {
        // Broadcast it to all other relevant clients
        console.log('Received: ' + msg);
        msg = JSON.parse(msg);
        var clients = Array.from(req.app.wsInstance.getWss().clients);
        clients = clients.filter(c => c.protocol == 'chat' && c.chatID == ws.chatID/* && c.userID != ws.userID*/);
        for(c of clients) {
            c.send(JSON.stringify({author:ws.userID, text:msg.text, timestamp:Date.now()}));
        }
        // Update the database
        const update = {$push: {chat: {text:msg.text, author:ws.userID}}};
        DirectMessage.findByIdAndUpdate(ws.chatID, update, function(err) {
            if(err) console.log(err);
        });
    });
}

exports.update = function(ws, req) {
    // Runs once on connection, setting userID of this connection
    ws.userID = req.query.userID;
}