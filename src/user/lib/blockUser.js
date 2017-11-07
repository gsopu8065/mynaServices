var app = require('myna-server').app;
var mongoDbConnection = require('myna-server').mongoDb.closedConnection;
var ValidationError = require('myna-server').ValidationError;
var ObjectID = require('mongodb').ObjectID;
var Promise = require('bluebird');
/*
 {
 "userId" : "123",
 "blockUserId":"123"
 }
 */
app.post('/myna/user/blockUser', function (req, res) {

    if (!req.body.blockUserId || !req.body.userId)
        throw new ValidationError("Missing Fields");

    Promise.using(mongoDbConnection(), conn => {
        return conn.collection('users')
            .update({ _id: req.body.userId }, {
                $addToSet: {
                    blocks: req.body.blockUserId
                }
            }, { upsert: true })
            .then(out => res.status(200).send("Update Sucess"))

    }).catch(err => res.status(500).send(err.stack));
});
