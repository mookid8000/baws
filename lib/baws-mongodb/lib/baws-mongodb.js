var mongojs = require('mongojs');

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

console.log('database: ' + db);
console.log('status ' + db.status);

exports.insertStatus = function(status, callback) {
    db.status.insert(status, function(err) {
        if (callback) {
            callback(err);
            return;
        }
    });
}




var map = function () {
    emit({ns:this.ns, name:this.name}, {time:this.time, id:this._id});
}

var reduce = function (key, values) {
    var maxTime = values[0].time;
    var id = values[0].id;
    for (var index = 1; index < values.length; index++) {
        if (values[index].time <= maxTime) {
            continue;
        }
        maxTime = values[index].time;
        id = values[index].id;
    }
    return {time:maxTime, id:id};
}

