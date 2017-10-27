var app = require('myna-server').app;
var mongoDbConnection = require('myna-server').mongoDb;
var ValidationError = require('myna-server').ValidationError;
var getStatus = require('myna-global').getStatus;
var ObjectID = require('mongodb').ObjectID;

/* {
 "statusId":"statusId",
 "status": "hello world4",
 "userId":"12345"
 }*/
app.post('/myna/status/editStatus', function (req, res) {
    mongoDbConnection(function (databaseConnection) {
        databaseConnection.collection('status', function (error, collection) {
            collection.update({_id: ObjectID(req.body.statusId)}, {
                    $set: {
                        "status": req.body.status,
                        "timeStamp": Math.floor(Date.now())
                    }
                },
                function (err, records) {

                    if (err)
                        throw new ValidationError(JSON.stringify(err), 500);

                    getStatus(req.body.statusId, req.body.userId)
                        .then(function (statusres) {
                            res.status(200).send(statusres);
                        }, function (statusError) {
                            throw new ValidationError(JSON.stringify(statusError), 500);
                        });

                })
        })
    });
});