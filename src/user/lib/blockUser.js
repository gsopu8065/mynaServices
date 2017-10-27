var app = require('myna-server').app;
var mongoDbConnection = require('myna-server').mongoDb;
var ValidationError = require('myna-server').ValidationError;

/*
 {
 "userId" : "123",
 "blockUserId":"123"
 }
 */
app.post('/myna/user/blockUser', function (req, res) {

    if(!req.body.blockUserId || !req.body.userId)
        throw new ValidationError("Missing Fields");

    mongoDbConnection(function (databaseConnection) {
        databaseConnection.collection('users2', function (error, collection) {

            if(error)
                throw new ValidationError(JSON.stringify(error))

            collection.update({_id: req.body.userId}, {
                $addToSet: {
                    blocks: req.body.blockUserId
                }
            }, {upsert: true}, function (err, records) {

                if (err) {
                    throw new ValidationError(JSON.stringify(err), 500);
                } else {
                    res.status(200).send("Update Sucess")
                }
            })
        })
    })

});
