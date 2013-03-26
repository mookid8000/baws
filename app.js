var express = require('express.io');
var app = express().http().io();
var io = app.io;
var baws = require('./lib/baws-mongodb');
var _ = require('underscore');

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

    baws.loadCurrentStatuses(ns, function(err, statuses) {
        res.render('index', { ns: ns, initialStatuses: JSON.stringify(statuses) });
    });
});

app.get('/:ns/:n', function(req, res) {
    var ns = req.params.ns;
    var name = req.params.n;

    baws.loadCurrentStatus(ns, name, function(err, status) {
        baws.loadStatusHistory(ns, name, 30, function(err, history) {
            var model = { 
                ns: ns, 
                name: name, 
                status: JSON.stringify(status),
                history: JSON.stringify(_.map(history, function(h) {
                    return h.s;
                }))
            };

            res.render('show', model);
        });
    })
});

app.post('/status', function(req, res) {
    var status = req.body;

    if (typeof status.s === 'undefined') {
        res.end();
        return;
    }

    if (typeof status.s.dt === 'undefined') {
        status.s.dt = new Date();
    }

    baws.insertStatus(status, function(err) {
        io.sockets.emit('new status:' + status.ns, status);
        res.end();
    });
});

console.log('listening...')
app.listen(process.env.PORT || 3000);
