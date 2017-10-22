var app = require('myna-server').app;

app.get('/myna/user/blockUser', function (req, res) {
    res.send('Block User');
});