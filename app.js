var express = require('express.io');
var app = express().http().io();
var io = app.io;
var mongo = require('mongodb');
var qmongo = require('q-mongodb');
var baws = require('./lib/baws-mongodb');

app.use(express.bodyParser());
app.use(express.static('public'));

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.get('/', function(req, res) {
    res.render('help');
});

app.get('/:ns', function(req, res) {
    var ns = req.params.ns;

    res.render('index', { ns: ns });
});

app.post('/status', function(req, res) {
    var status = req.body;
    status.time = new Date();

    req.io.broadcast('new status:' + status.ns, status);

    baws.insertStatus(status, function(err) {
        res.end();
    });
});

console.log('listening...')
app.listen(process.env.PORT || 3000);
