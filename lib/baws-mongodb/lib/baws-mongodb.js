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

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

exports.insertStatus = function(status, callback) {
    db.statusHistory.insert(status, function(err) {
        var ns = status.ns;
        var n = status.n;
        var s = status.s;

        var query = {ns: ns, n: n};
        var update = {$set: {s: s}};

        db.currentStatus.update(query, update, {upsert: true}, callback);
    });
}

exports.loadCurrentStatuses = function(ns, callback) {
    db.currentStatus.find({ns: ns}, callback);
};

exports.loadCurrentStatus = function(ns, name, callback) {
    db.currentStatus.findOne({ns: ns, n: name}, callback);
};

exports.loadStatusHistory = function(ns, name, minutes, callback) {
    var from = addMinutes(new Date(), -minutes);;
    var query = {ns: ns, n: name, "s.dt": {"$gte": from}};
    
    db.statusHistory.find(query, {sort: {"s.dt": -1}}, callback);
}

db.statusHistory.ensureIndex({"ns": 1, "n": 1, "s.dt": -1});
db.currentStatus.ensureIndex({"ns": 1});
