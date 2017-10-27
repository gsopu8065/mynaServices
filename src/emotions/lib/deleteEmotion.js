var app = require('myna-server').app;
var mongoDbConnection = require('myna-server').mongoDb;
var ValidationError = require('myna-server').ValidationError;
var getStatus = require('myna-global').getStatus;
var ObjectID = require('mongodb').ObjectID;

/*
 {
 "statusId" : "123",
 "userId": "12345",
 "emotion":"251"
 }
 */
app.post('/myna/emotions/deleteStatusEmotion', function (req, res) {

    mongoDbConnection(function (databaseConnection) {

        //update emotion
        var statusPromise = new Promise(function (resolve, reject) {

            databaseConnection.collection('status', function (error, collection) {

                var increaseField = {};
                increaseField["emotions." + req.body.emotion] = req.body.userId;
                collection.update({"_id": ObjectID(req.body.statusId)},
                    {$pull: increaseField},
                    {multi: true}
                    , function (err, records) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(records)
                        }
                    })


            });
        });

        //update user
        statusPromise.then(function (dbres, err) {

            if (err)
                throw new ValidationError(JSON.stringify(err), 500);

            databaseConnection.collection('users', function (error, collection) {

                collection.update({_id: req.body.userId},
                    {$pull: {status: {statusId: req.body.statusId}}}
                    , function (err, records) {
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
        })

    });
});