var express = require('express.io');
var app = express().http().io();
var io = app.io;
var mongo = require('mongodb')

app.use(express.bodyParser());
app.use(express.static('public'));

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.get('/', function(req, res) {
    res.render('help');
});

app.get('/:ns', function(req, res) {
    res.render('index', { ns: req.params.ns });
});

app.post('/status', function(req, res) {
    var body = req.body;
    req.io.broadcast('new status:' + body.ns, body);
    res.end();
});

mongo.connect('mongodb://192.168.33.130/baws', function(err, db) {
    db.collection('what', function(err, c) {
        c.insert({text: "hello world!"})
    })
});

app.listen(process.env.PORT || 3000);