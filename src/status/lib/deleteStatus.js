var app = require('myna-server').app;

app.get('/myna/status/deleteStatus', function (req, res) {
    res.send('Delete Status');
});