var mongojs = require('mongojs');
var _ = require('underscore');

exports = module.exports;

var mongoUri;
if (process.env.MONGOHQ_URL) {
    mongoUri = process.env.MONGOHQ_URL;
} else {
    var mongoUrl = process.env.MongoUrl || "mongodb://10.0.0.10"
    var databaseName = process.env.DatabaseName || "baws";
    mongoUri = mongoUrl + '/' + databaseName;
}

var db = mongojs(mongoUri, ['status', 'currentStatus']);

console.log('mongo: ' + mongoUri);

exports.insertStatus = function(status, callback) {
    db.status.insert(status, function(err) {
        var ns = status.ns;
        var n = status.n;
        var s = status.s;
        var dt = status.dt;

        var query = {ns: ns, n: n};
        var update = {$set: {s: s, dt: dt}};

        db.currentStatus.update(query, update, {upsert: true}, callback);
    });
}

exports.loadRecentStatus = function(ns, callback) {
    db.currentStatus.find({ns: ns}, callback);
};

db.status.ensureIndex({ns: 1, n: 1, dt: -1});
