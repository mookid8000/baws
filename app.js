var express = require('express.io');
var app = express().http().io();
var io = app.io;

app.use(express.bodyParser());
app.use(express.static('public'));

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

var index = function(req, res) {
    res.render('index', { ns: req.params.ns });
};

app.get('/', index);
app.get('/:ns', index);

app.post('/status', function(req, res) {
    var body = req.body;
    req.io.broadcast('new status:' + body.ns, body);
    res.end();
});

app.listen(process.env.PORT || 3000);