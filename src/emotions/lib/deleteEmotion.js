var app = require('myna-server').app;

app.get('/myna/emotions/deleteEmotion', function (req, res) {
    res.send('Delete Emotion');
});