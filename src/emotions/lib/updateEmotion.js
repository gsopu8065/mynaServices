var app = require('myna-server').app;

app.get('/myna/emotions/updateEmotion', function (req, res) {
    res.send('Update Emotion');
});