var app = require('myna-server').app;
var mongoDbConnection = require('myna-server').mongoDb.openConnection;
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
app.post('/myna/emotions/updateStatusEmotion', function (req, res) {

    var databaseConn = undefined;
    mongoDbConnection()
        .then(databaseConnection => {
            databaseConn = databaseConnection;
            return deleteExsistingEmotion(databaseConn, req.body)
        })
        .then(deletedStatusEmotion => updateEmotion(databaseConn, req.body))
        .then(updatedStatusEmotion => {
            return databaseConn.collection('users')
                .find({
                    _id: req.body.userId,
                    status: { $elemMatch: { statusId: req.body.statusId } }
                }).toArray()
                .then(userRes => {
                    var doc = userRes[0] || undefined;
                    return insertOrUpdateUser(databaseConn, req.body, doc)
                })
        })
        .then(updateStatusResult => {
            databaseConn.close();
            res.status(200).send(updateStatusResult)
        })
        .catch(err => {
            databaseConn.close();
            res.status(500).send(err.stack)
        });
});

var deleteExsistingEmotion = function (databaseConnection, requestBody) {
    return databaseConnection.collection('status')
        .update({ "_id": ObjectID(requestBody.statusId) }, { $pull: { "emotions.like": requestBody.userId, "emotions.dislike": requestBody.userId } }, { multi: true })
        .then(updateStatus => { return Promise.resolve("Deleted Status Emotion Sucess") })
        .catch(error => { return Promise.reject(error) });
};

var updateEmotion = function (databaseConnection, requestBody) {
    var increaseField = {};
    increaseField["emotions." + requestBody.emotion] = requestBody.userId;

    return databaseConnection.collection('status')
        .update({ "_id": ObjectID(requestBody.statusId) }, { $addToSet: increaseField }, { upsert: true })
        .then(updateStatus => { return Promise.resolve("Update Status Emotion Sucess") })
        .catch(error => { return Promise.reject(error) });
};


var insertOrUpdateUser = function (databaseConnection, requestBody, user) {

    var parameter1 = (user == undefined) ? { _id: requestBody.userId } : { _id: requestBody.userId, status: { $elemMatch: { statusId: requestBody.statusId } } };
    var parameter2 = (user == undefined) ? {
        $addToSet: {
            status: {
                statusId: requestBody.statusId,
                emotion: requestBody.emotion
            }
        }
    } : {
            $set: {
                "status.$": {
                    statusId: requestBody.statusId,
                    emotion: requestBody.emotion
                }
            }
        };
    var parameter3 = (user == undefined) ? { upsert: true } : { upsert: false };

    return databaseConnection.collection('users')
        .update(parameter1, parameter2, parameter3)
        .then(updateStatus => { return getStatus(requestBody.statusId, requestBody.userId) })
        .catch(error => { return Promise.reject(error) });
};