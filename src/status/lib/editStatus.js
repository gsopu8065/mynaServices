var app = require('myna-server').app;

app.get('/myna/status/editStatus', function (req, res) {
    res.send('Edit Status');
});