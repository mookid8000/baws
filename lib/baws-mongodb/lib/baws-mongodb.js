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

var db = mongojs(mongoUri, ['status']);

console.log('mongo: ' + mongoUri);

exports.insertStatus = function(status, callback) {
    db.status.insert(status, callback);
}

exports.loadRecentStatus = function(ns, callback) {
    var pipeline = [
        {$match: {ns: "test"}},
        {$sort: {dt: -1}},
        {$group: {_id: {name: "$n"}}}
    ];

    db.status.aggregate(pipeline, function(err, results) {
        var docs = [];

        var loadStatus = function(index) {
            if (index < results.length) {
                var name = results[index]["_id"]["name"];

                var query = {ns: ns, n: name};
                var options = {limit:1, sort: {dt:-1}};

                db.status.find(query, options, function(err, doc) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    if (doc.length == 1) {
                        docs.push(doc[0]);
                    }
                    loadStatus(index + 1);
                });
            } else {
                callback(null, docs);
            }
        };

        loadStatus(0);
    });
};

db.status.ensureIndex({ns: 1, n: 1, dt: -1});
