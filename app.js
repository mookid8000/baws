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

    socket.emit('news', {hello: "world"});
    socket.on('my other event', function(data) {
        console.log('got other event: %s', data);
    });
});

io.on('my other event', function(socket) {
    console.log('hit the other handler')
})

app.get('/', function(req, res) {
    res.render('index');
});

app.post('/status', function(req, res) {
    var body = req.body;
    console.log('%s/%s: %s', body.ns, body.name, body.status.color);
    res.end();
});

app.listen(3000);