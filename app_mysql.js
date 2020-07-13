// mysql module
var mysql = require('mysql');

// DB connection
var conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'kimsh4549',
    database : 'o2',
});
conn.connect();

// mysql로 데이터 저장하는 블로그
var express = require("express");
var bodyparser = require("body-parser");
var app = express();

app.use(bodyparser.urlencoded({ extended : false}));

// view engine : jade 세팅
app.set("view engine", 'jade');
app.set('views', './views_mysql');

// static file
app.use(express.static('public'));
app.locals.pretty = true;

app.get('/topic/new', function(req, res)    {
    var sql = 'SELECT id,title FROM topic';
    conn.query(sql,function(err,topics,fields)  {
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('new',{topics : topics});
    })
});

app.get(['/topic','/topic/:id'], function(req,res) {
    var sql = 'SELECT id,title FROM topic';
    var id = req.params.id;
    conn.query(sql,function(err,topics,fields){
        if (id) {
            var sql = 'SELECT * FROM topic WHERE id = ?';
            conn.query(sql,[id], function(err,detail,fields)    {
                if(err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }
                else    {
                    res.render('view',{topics : topics, topic:detail[0]});        
                }
            })
        }
        else    {
            res.render('view',{topics : topics});
        }
    })
});

app.get(['/topic/:id/edit'], function(req, res)    {
    var sql = 'SELECT id,title FROM topic';
    var id = req.params.id;

    conn.query(sql,function(err,topics,fields){
        if (id) {
            var sql = 'SELECT * FROM topic WHERE id = ?';
            conn.query(sql,[id], function(err,detail,fields)    {
                if(err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }
                else    {
                    res.render('edit',{topics : topics, topic:detail[0]});        
                }
            })
        }
        else    {
            console.log('There is no id');
            res.status(500).send('Internal Server Error');
        }
    })
});

app.post('/topic/:id/success', function(req, res)    {
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var id = req.params.id;

    var sql = 'UPDATE topic SET title=?, description=?, created=NOW(), author=? WHERE id = ?';
    conn.query(sql,[title,description,author,id],function(err,topics,fields){
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        else    {
            res.redirect('/topic/'+id);
        }
    })
});

app.get('/topic/:id/delete', function(req,res)  {
    var sql = 'SELECT id,title FROM topic';
    var id = req.params.id;
    conn.query(sql,function(err,topics,fields){
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        else    {
            var sql = 'DELETE FROM topic WHERE id = ?';
            conn.query(sql,[id],function(err,topics,fields){
                if(err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }
                else   {
                    res.render('delete',{topics:topics});
                }
            })
        }
    })

    conn.query(sql,[id],function(err,topics,fields){
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        else   {
            res.redirect('/topic/');
        }
    })
});

app.post('/topic/success', function(req,res)    {
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;

    var sql = 'INSERT INTO topic(title,description,created,author)\
    VALUES(?,?,NOW(),?)';

    conn.query(sql,[title, description, author] , function(err,topics,fields)   {
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        var sql = "SELECT id FROM topic WHERE title = ?";
        res.redirect('/topic/'+ topics.insertId);
    })
});


app.listen(3000, function(req, res)     {
    console.log("Connect Port 3000!");
});

