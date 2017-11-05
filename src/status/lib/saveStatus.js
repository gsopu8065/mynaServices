var app = require('myna-server').app;
var mongoDbConnection = require('myna-server').mongoDb.openConnection;
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
    status.isExpired = false;
    status.isGlobal = status.isGlobal || false;
    status.emotions = {
        "like": [],
        "dislike": []
    };

    if (status.type == 'text') 
        status.replyCount = 0;
    
    updateStatusLocation(status)
        .then(locationUpdatedStatus => saveImagesOnS3(locationUpdatedStatus, req.files))
        .then(mediaUpdatedStatus => {
            return (mediaUpdatedStatus.type == 'commentText') ? commentSave(mediaUpdatedStatus) : statusSave(mediaUpdatedStatus);
        })
        .then(saveStatusResult => res.status(200).send(saveStatusResult))
        .catch(err => res.status(500).send(err.stack));
});

var commentSave = function (status) {
    return mongoDbConnection()
        .then(databaseConnection => {
            var statusCollection = databaseConnection.collection('status')
            return statusCollection
                .update({ _id: ObjectID(status.statusGroupId) }, { $inc: { replyCount: 1 } })
                .then(updateRes => {
                    return statusCollection
                        .insert(status)
                        .then(insertedStatus => {
                            databaseConnection.close();
                            return getStatusWithReplies(status.statusGroupId, status.userId)
                        })
                        .catch(error => { databaseConnection.close(); return Promise.reject(error) });
                })
                .catch(error => { databaseConnection.close(); return Promise.reject(error) });
        })
        .catch(error => { return Promise.reject(error) });
};

var statusSave = function (status) {
    return mongoDbConnection()
    .then(databaseConnection => {
        return databaseConnection.collection('status')
        .insert(status)
        .then(insertedStatus => {
            databaseConnection.close();
            return Promise.resolve("Inserted Sucessfully")
        })
        .catch(error => { databaseConnection.close(); return Promise.reject(error) });
    })
    .catch(error => { return Promise.reject(error) });
};