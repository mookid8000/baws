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

console.log('mongo: ' + mongoUri);

var db = mongojs(mongoUri, ['statusHistory', 'currentStatus']);

exports.insertStatus = function(status, callback) {
    db.statusHistory.insert(status, function(err) {
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

db.statusHistory.ensureIndex({ns: 1, n: 1, dt: -1});
db.currentStatus.ensureIndex({ns: 1});
