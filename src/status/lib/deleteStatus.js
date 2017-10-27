var app = require('myna-server').app;
var mongoDbConnection = require('myna-server').mongoDb;
var ValidationError = require('myna-server').ValidationError;
var ObjectID = require('mongodb').ObjectID;

/* {
 "statusId":"statusId",
 "userId":"12345"
 }*/
app.post('/myna/status/deleteStatus', function (req, res) {
    mongoDbConnection(function (databaseConnection) {
        databaseConnection.collection('status', function (error, collection) {
            collection.update({_id: ObjectID(req.body.statusId)}, {
                    $set: {
                        "condition": 0,
                        "timeStamp": Math.floor(Date.now())
                    }
                },
                function (err, records) {

                    if (err)
                        throw new ValidationError(JSON.stringify(err), 500);

                    res.status(200).send(records);
                })
        })
    });
});