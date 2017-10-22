var app = require('myna-server').app;

app.get('/myna/news/getNews', function (req, res) {
    res.send('getNews');
});