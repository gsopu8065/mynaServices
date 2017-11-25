var app = require('myna-server').app;
var mongoDbConnection = require('myna-server').mongoDb.closedConnection;
var ObjectID = require('mongodb').ObjectID;
var Promise = require('bluebird');
var getStatus = require('myna-global').getStatus;

/* {
 "statusId":"statusId",
 "status": "hello world4",
 "userId":"12345"
 }*/
app.post('/myna/status/editStatus', function (req, res) {

    Promise.using(mongoDbConnection(), conn => {
        return conn.collection('status')
            .update({ _id: ObjectID(req.body.statusId), userId: req.body.userId }, {
                $set: {
                    "status": req.body.status,
                    "timeStamp": Math.floor(Date.now())
                }
            })
            .then(updateStatus => { return getStatus(req.body.statusId, req.body.userId) })
            .then(response => res.status(200).send(response))
            .catch(err => res.status(500).send(err.stack));

    }).catch(err => res.status(500).send(err.stack));

});