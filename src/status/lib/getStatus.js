var app = require('myna-server').app;
var getStatusWithReplies = require('myna-global').getStatusWithReplies;

//?statusId=123&userId=1234
app.get('/myna/status/getStatus', function (req, res) {

    getStatusWithReplies(req.query.statusId, req.query.userId)
        .then(statusres => res.status(200).send(statusres))
        .catch(statusError => res.status(500).send(statusError.stack));

});