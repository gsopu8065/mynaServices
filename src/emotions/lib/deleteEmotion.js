var app = require('myna-server').app;
var mongoDbConnection = require('myna-server').mongoDb.openConnection;
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

    var databaseConn = undefined;
    mongoDbConnection()
        .then(databaseConnection => {
            databaseConn = databaseConnection;
            return updateStatus(databaseConn, req.body)
        })
        .then(updateStatus => updateUser(databaseConn, req.body))
        .then(updateStatusResult => {
            databaseConn.close();
            res.status(200).send(updateStatusResult)
        })
        .catch(err => {
            databaseConn.close();
            res.status(500).send(err.stack)
        });

});

var updateStatus = function (databaseConnection, requestBody) {
    var increaseField = {};
    increaseField["emotions." + requestBody.emotion] = requestBody.userId;

    return databaseConnection.collection('status')
        .update({ "_id": ObjectID(requestBody.statusId) }, { $pull: increaseField }, { multi: true })
        .then(updateStatus => { return Promise.resolve("Status Update Sucess") })
        .catch(error => { return Promise.reject(error) });
};

var updateUser = function (databaseConnection, requestBody) {
    return databaseConnection.collection('users')
        .update({ _id: requestBody.userId }, { $pull: { status: { statusId: requestBody.statusId } } })
        .then(updateStatus => { return getStatus(requestBody.statusId, requestBody.userId) })
        .catch(error => { return Promise.reject(error) });
};