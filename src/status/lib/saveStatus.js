var app = require('myna-server').app;

app.get('/myna/status/saveStatus', function (req, res) {
    res.send('save status');
});