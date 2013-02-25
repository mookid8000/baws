var express = require('express.io');
var app = express().http().io();
var io = app.io;

app.use(express.bodyParser());
app.use(express.static('public'));

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.get('/:ns', function(req, res) {
    res.render('index', { ns: req.params.ns });
});

app.post('/status', function(req, res) {
    var body = req.body;
    req.io.broadcast('new status:' + body.ns, body);
    res.end();
});

app.listen(3000);