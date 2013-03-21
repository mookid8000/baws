var express = require('express.io');
var app = express().http().io();
var io = app.io;
var baws = require('./lib/baws-mongodb');

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

app.use(express.bodyParser());
app.use(express.static('public'));

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.get('/', function(req, res) {
    res.render('help');
});

app.get('/:ns', function(req, res) {
    var ns = req.params.ns;

    baws.loadRecentStatus(ns, function(err, statuses) {
        res.render('index', { ns: ns, initialStatuses: JSON.stringify(statuses) });
    });
});

app.post('/status', function(req, res) {
    var status = req.body;

    if (typeof status.dt === 'undefined') {
        status.dt = new Date();
    }

    req.io.broadcast('new status:' + status.ns, status);

    baws.insertStatus(status, function(err) {
        res.end();
    });
});

console.log('listening...')
app.listen(process.env.PORT || 3000);
