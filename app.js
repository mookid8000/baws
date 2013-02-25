var express = require('express.io');
var app = express().http().io();
var io = app.io;

app.use(express.bodyParser());
//app.use(express.directory('public'));
app.use(express.static('public'));

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

io.on('connection', function(socket) {
    console.log('new connection!');

    //socket.emit('news', {hello: "world"});
    //socket.on('new status', function(data) { });
});

app.get('/:ns', function(req, res) {
    res.render('index', {
        ns: req.params.ns
    });
});

app.post('/status', function(req, res) {
    var body = req.body;
    //console.log('%s/%s: %s', body.ns, body.name, body.status.color);
    req.io.broadcast('new status:' + body.ns, body);
    res.end();
});

app.listen(3000);