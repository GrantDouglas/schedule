const mysql = require('mysql');
const bcrypt = require('bcrypt');

var LocalStrategy = require('passport-local').Strategy;

var pool = mysql.createPool({
    host: 'localhost',
    user: 'schedule',
    password: 'testing456',
    database: 'scheduling',
    connectionLimit: 10,
    supportBigNumbers: true
})

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        pool.getConnection( (err, connection) => {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        connection.query("select * from users where id = "+id,function(err,rows){
            done(err, rows[0]);
        });
    })});

    console.log("nope");

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback:true
    },
    function(req, name, password, done) {

        console.log(name);
        console.log(password);
        pool.getConnection( (err, connection) => {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        connection.query("select * from users where name = '"+name+"'",function(err,rows) {
            console.log(rows);
            console.log("above row object");
            if (err) {
                return done(err);
            }
            if (rows.length) {
                console.log("people exist");
                return done(null, false, {message: 'User already exists'});
            } else {
                var newUserMysql = new Object();

                newUserMysql.name    = name;
                newUserMysql.password = password; // use the generateHash function in our user model

                var insertQuery = "INSERT INTO users ( name, password ) values ('" + name +"','"+ password +"')";
                console.log(insertQuery);
                connection.query(insertQuery,function(err,rows){
                    newUserMysql.id = rows.insertId;
                    return done(null, newUserMysql);
                });
            }
        });
        });
    }));
}

