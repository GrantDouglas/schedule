const mysql = require('mysql');


var pool = mysql.createPool({
    host: 'localhost',
    user: 'schedule',
    password: 'testing456',
    database: 'scheduling',
    connectionLimit: 10,
    supportBigNumbers: true
})

var newUser = function(UserObj, callback) {

    console.log(UserObj);

    var sql = "insert into users(name, password) values (\'" + UserObj.name + "\', \'" + UserObj.password + "\');";

    pool.getConnection( (err, connection) => {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        connection.query(sql, (err, results) => {
            connection.release();
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, results);
        });
    });

}

var getTime = function(callback) {

    var sql = "select * from times;";

    pool.getConnection( (err, connection) => {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        connection.query(sql, (err, results) => {
            connection.release();
            if(err) {
                console.log(err);
                callback(true);
                return;
            }

            var res = JSON.parse(JSON.stringify(results));


            callback(false, res);
        });
    });

}


var getRecord = function(callback) {

    var sql = "select * from record;";

    pool.getConnection( (err, connection) => {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        connection.query(sql, (err, results) => {
            connection.release();
            if(err) {
                console.log(err);
                callback(true);
                return;
            }

            var res = JSON.parse(JSON.stringify(results));


            callback(false, res);
        });
    });

}


module.exports.getTime = getTime
module.exports.newUser = newUser
module.exports.getRecord = getRecord
