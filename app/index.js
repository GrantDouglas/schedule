const express = require('express');
const bodyParser = require('body-parser');
const db = require("./src/db")
const app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false})


app.set('view engine', 'ejs');

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

app.post('/create', urlencodedParser, (req, res) => {
    console.log(req.body);
    if (!req.body) return res.sendStatus(400);

    db.newUser(req.body, (err, results) => {
        if (err) {
            // res.send(500, "server error");
            return;
        }
        console.log(results);

    });

    res.redirect('user-tables');

});

app.get('/profile/:id', (req, res) => {
    // res.send('You wanted to see profile ' + req.params.id);
    res.render('profile', {id: req.params.id});
});


app.listen(8000, () => {
  console.log('Example app listening on port 8000!');
});
