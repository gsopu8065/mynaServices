var app = require('myna-server').app;
var mongoDbConnection = require('myna-server').mongoDb.closedConnection;
var ObjectID = require('mongodb').ObjectID;
var Promise = require('bluebird');

/* {
 "statusId":"statusId",
 "userId":"12345"
 }*/
app.post('/myna/status/deleteStatus', function (req, res) {

    Promise.using(mongoDbConnection(), conn => {
        return conn.collection('status')
            .update({ _id: ObjectID(req.body.statusId), userId: req.body.userId }, {
                $set: {
                    "condition": 0,
                    "timeStamp": Math.floor(Date.now())
                }
            })
            .then(out => res.status(200).send(out))

    }).catch(err => res.status(500).send(err.stack));

});