var app = require('myna-server').app;

app.get('/myna/user/reportIssue', function (req, res) {
    res.send('Report Issue');
});