var app = require('myna-server').app;
var getStatusWithReplies = require('myna-global').getStatusWithReplies;
var ValidationError = require('myna-server').ValidationError;

//?statusId=123&userId=1234
app.get('/myna/status/getStatus', function (req, res) {

    getStatusWithReplies(req.query.statusId, req.query.userId)
        .then(function (statusres) {
            res.status(200).send(statusres);
        }, function (statusError) {
            throw new ValidationError(JSON.stringify(statusError), 500);
        });
});