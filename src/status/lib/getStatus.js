var app = require('myna-server').app;

app.get('/myna/status/getStatus', function (req, res) {
    res.send('get Status');
});