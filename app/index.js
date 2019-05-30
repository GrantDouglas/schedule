const express = require('express');
const bodyParser = require('body-parser');
const db = require("./src/db")
const passport = require("passport");
const LocalStrategy =require('passport-local').Strategy;
var flash = require('connect-flash');
var session=require('express-session');
const app = express();



var urlencodedParser = bodyParser.urlencoded({ extended: false})

app.use(urlencodedParser);




app.set('view engine', 'ejs');

app.use(session({
    secret:'blah',
    key:'blad',
    cookie:{maxAge:60000},
    resave:false,
    saveUninitialized:true
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);



app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/test', (req, res) => {
  res.send('this is a test!');
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/user-tables', (req, res) => {

    db.getTime((err, results) => {

        if (err) {
            return;
        }

        var times = results;

        db.getRecord((err, results) => {

            if (err) {
                return;
            }

            var records = results;

            for(var i =  0; i < records.length; i++) {
                var date = new Date(records[i].dateChange);
                var newDate = [date.getDate(), date.getMonth()+1, date.getFullYear()].join("/");
                records[i].dateChange = newDate
            }

            console.log(times);
            console.log(records);
            res.render('user-tables', {data: times, record: records});
        })



    })

    // res.render('user-tables', {data: 0});


});

// app.post('/auth', urlencodedParser, function(req, res) {
//     console.log("parsing:", req.body);
// })

// app.post('/create', urlencodedParser, (req, res, next) => {
//     console.log(req.body);
//     if (!req.body) return res.sendStatus(400);

//     // db.auth(passport, (err, results) => {
//     //     if (err) {
//     //         // res.send(500, "server error");
//     //         return;
//     //     }
//     //     console.log(results);

//     // });

//     passport.authenticate('local-signup', function(err, user, info) {
//         if (err) { return next(err); }
//         if (!user) { return res.redirect('/login'); }
//         req.logIn(user, function(err) {
//           if (err) { return next(err); }
//           return res.redirect('/users/' + user.username);
//         });
//     })(req, res, next);

//     res.redirect('user-tables');

// });

app.post('/auth', passport.authenticate('local-signup', { successRedirect: '/user-tables', failureRedirect: '/create', failureFlash: true }));




// app.post('/auth', urlencodedParser, passport.authenticate('local-signup'), function(req, res){
//   console.log("passport user", req.user);
// });

app.get('/profile/:id', (req, res) => {
    // res.send('You wanted to see profile ' + req.params.id);
    res.render('profile', {id: req.params.id});
});


app.listen(8000, () => {
  console.log('Example app listening on port 8000!');
});
