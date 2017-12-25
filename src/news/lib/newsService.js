var app = require('myna-server').app;
var mongoDbConnection = require('myna-server').mongoDb.openConnection;
var _ = require('lodash');

/*{
 "location":[-77.18621789486043,
 38.82741811639861],
 "radius":3,
 "userId":"1234"
 }*/
app.post('/myna/news/newsFeed', function (req, res) {
    var location = req.body.location;
    var radius = req.body.radius;
    var userId = req.body.userId;

    var databaseConn = undefined;
    mongoDbConnection()
        .then(databaseConnection => {
            databaseConn = databaseConnection;
            return getNearByStatus(databaseConn, location, radius, userId)
        })
        .then(statusResult => removeBlockedUsers(databaseConn, userId, statusResult))
        .then(statusResult => {
            databaseConn.close();
            res.status(200).send(statusResult)
        })
        .catch(err => {
            if(databaseConn)
                databaseConn.close();
            res.status(500).send(err.stack)
        });
});

var getNearByStatus = function (databaseConnection, location, radius, userId) {
    var myLocation = [location.longitude, location.latitude];
    var statusCollection = databaseConnection.collection('status');
    statusCollection.ensureIndex({ "location": "2d" })
    return statusCollection.find({
        $or: [
            { location: { $geoWithin: { $centerSphere: [myLocation, radius / 3963.2] } } },
            { isGlobal: true }
        ],
        "type": "text",
        "condition": 1,
        "isExpired": { '$ne': true }
    })
        .sort({ timeStamp: 1 }).limit(50).toArray()
        .then(dbres => {
            var sortedRes = _.sortBy(dbres, [function(eachStatus) { return eachStatus.emotions.like.length + eachStatus.emotions.dislike.length + eachStatus.replyCount; }]);
            _.forEach(sortedRes, function (eachStatus, index) {
                var likeIndex = _.findIndex(eachStatus.emotions.like, function (o) { return o == userId; });
                var dislikeIndex = _.findIndex(eachStatus.emotions.dislike, function (o) { return o == userId; });
                if (likeIndex != -1)
                    eachStatus.userstatusEmotion = 'like'

                if (dislikeIndex != -1)
                    eachStatus.userstatusEmotion = 'dislike'

                eachStatus.sort = index;
                eachStatus.likeCount = eachStatus.emotions.like.length;
                eachStatus.dislikeCount = eachStatus.emotions.dislike.length
                delete eachStatus.emotions
            });
            return Promise.resolve(sortedRes);
        })
        .catch(error => { return Promise.reject(error) });
};

var removeBlockedUsers = function (databaseConnection, userId, statusResult) {
    return databaseConnection.collection('users')
        .find({ _id: userId })
        .toArray()
        .then(userRes => {
            var doc = userRes[0] || undefined;
            if (doc) {
                _.remove(statusResult, function (eachStatus) {
                    return _.indexOf(doc.blocks, eachStatus.userId) != -1;
                });
                return Promise.resolve(statusResult);
            }
            else {
                return Promise.resolve(statusResult);
            }
        })
        .catch(error => { return Promise.reject(error) });

};