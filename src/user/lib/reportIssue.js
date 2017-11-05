var app = require('myna-server').app;
var mongoDbConnection = require('myna-server').mongoDb.closedConnection;
var ValidationError = require('myna-server').ValidationError;

/*{
 "statusId":"123456"
 "reportType":[1 to 3],
 "userId":"1234"
 }*/
app.get('/myna/user/reportIssue', function (req, res) {

    Promise.using(mongoDbConnection(), conn => {
        return conn.collection('report')
            .insert(req.body)
            .then(out => res.status(200).send("Report Sucess"))

    }).catch(err => res.status(500).send(err.stack));
});