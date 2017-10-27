var app = require('myna-server').app;
var mongoDbConnection = require('myna-server').mongoDb;
var ValidationError = require('myna-server').ValidationError;

/*{
 "statusId":"123456"
 "reportType":[1 to 3],
 "userId":"1234"
 }*/
app.get('/myna/user/reportIssue', function (req, res) {
    mongoDbConnection(function (databaseConnection) {
        databaseConnection.collection('report', function (error, collection) {
            collection.insert(req.body, function (err, records) {

                if(err)
                    throw new ValidationError(JSON.stringify(err), 500);

                res.status(200).send("Report Sucess")
            })
        })
    });
});