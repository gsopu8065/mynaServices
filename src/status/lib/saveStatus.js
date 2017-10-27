var app = require('myna-server').app;
var mongoDbConnection = require('myna-server').mongoDb;
var ValidationError = require('myna-server').ValidationError;
var updateStatusLocation = require('myna-global').updateStatusLocation;
var getStatusWithReplies = require('myna-global').getStatusWithReplies;
var _ = require('lodash');
var ObjectID = require('mongodb').ObjectID;

/* {
 "status": "hello world4",
 "media":[],
 "userId":"12345",
 "userName": "Jack",
 "location":[-77.18621789486043,
 38.82741811639861],
 "type": "text|commentText",
 "parentId" : null | "commentstatusId | statusId",
 "statusGroupId" : null | "statusId"
 }*/
app.post('/myna/status/saveStatus', function (req, res) {
    var status = req.body;
    status.timeStamp = Math.floor(Date.now());
    status.condition = 1;

    if (req.body.type == 'text') {
        status.replyCount = 0;
    }

    updateStatusLocation(status)
        .then(function (status1) {
            mongoDbConnection(function (databaseConnection) {
                databaseConnection.collection('status', function (error, collection) {
                    status1.emotions = {
                        "like": [],
                        "dislike": []
                    };

                    if (req.body.type == 'commentText') {
                        collection.update({_id: ObjectID(req.body.statusGroupId)}, {$inc: {replyCount: 1}}, function (err, records) {
                            collection.insert(status1, function (err, records) {
                                getStatusWithReplies(req.body.statusGroupId, req.body.userId)
                                    .then(function (statusres) {
                                        res.status(200).send(statusres);
                                    }, function (statusError) {
                                        throw new ValidationError(JSON.stringify(statusError), 500);
                                    });
                            })
                        })
                    }
                    else {
                        collection.insert(status1, function (err, records) {
                            if (err)
                                throw new ValidationError(JSON.stringify(err), 500);
                            res.status(200).send(records);
                        })
                    }
                })
            });
        }, function (updateError) {
            throw new ValidationError('Error in updating status location', 500)
        });
});