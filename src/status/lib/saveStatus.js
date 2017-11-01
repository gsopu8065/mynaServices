var app = require('myna-server').app;
var mongoDbConnection = require('myna-server').mongoDb;
var ValidationError = require('myna-server').ValidationError;
var updateStatusLocation = require('myna-global').updateStatusLocation;
var getStatusWithReplies = require('myna-global').getStatusWithReplies;
var saveImagesOnS3 = require('myna-global').saveImagesOnS3;

var _ = require('lodash');
var ObjectID = require('mongodb').ObjectID;
var Promise = require('bluebird');

/* {
 "status": "hello world4",
 "userId":"12345",
 "userName": "Jack",
 "location":[-77.18621789486043,
 38.82741811639861],
 "type": "text|commentText",
 "parentId" : null | "commentstatusId | statusId",
 "statusGroupId" : null | "statusId"
 }*/
app.post('/myna/status/saveStatus', function (req, res) {
    var status = JSON.parse(req.body.data);
    status.timeStamp = Math.floor(Date.now());
    status.condition = 1;

    if (status.type == 'text') {
        status.replyCount = 0;
    }
    status.emotions = {
        "like": [],
        "dislike": []
    };

    updateStatusLocation(status)
    .then((result) => saveImagesOnS3(result, req.files))
    .then((result) => {
        mongoDbConnection(function (databaseConnection) {
            databaseConnection.collection('status', function (error, collection) {
                if (result.type == 'commentText') {
                    collection.update({_id: ObjectID(result.statusGroupId)}, {$inc: {replyCount: 1}}, function (err, records) {
                        collection.insert(result, function (err, records) {
                            getStatusWithReplies(result.statusGroupId, result.userId)
                                .then(function (statusres) {
                                    res.status(200).send(statusres);
                                }, function (statusError) {
                                    throw new ValidationError(JSON.stringify(statusError), 500);
                                });
                        })
                    })
                }
                else {
                    collection.insert(result, function (err, records) {
                        if (err)
                            throw new ValidationError(JSON.stringify(err), 500);
                        res.status(200).send(records);
                    })
                }
            })
        });
    })
    .catch(function(err) {
        //Write error logs
        res.status(505).send(err);
    });
});