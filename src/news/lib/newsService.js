var app = require('myna-server').app;

/*{
 "location":[-77.18621789486043,
 38.82741811639861],
 "radius":3,
 "userId":"1234"
 }*/
app.get('/myna/news/newsFeed', function (req, res) {
    res.send('getNews');
});