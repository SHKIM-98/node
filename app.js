// 파일시스템을 이용하여 데이터 저장하는 블로그
var express = require("express");
var bodyparser = require("body-parser");
var fs = require('fs')
var app = express();

app.use(bodyparser.urlencoded({ extended : false}));

// view engine : jade 세팅
app.set("view engine", 'jade');
app.set('views', './views');

// static file 사용
app.use(express.static('public'));
app.locals.pretty = true;

app.get('/topic/new', function(req, res)    {
    fs.readdir('data', function(err,files)    {
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('new', {topics : files});
    })
});

app.get(['/topic','/topic/:id'], function(req,res) {
    fs.readdir('data', function(err,files)    {
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }

        var id = req.params.id;
        if(id)  {
        fs.readFile('data/'+ id, 'utf8', function(err,data) {
            if(err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
            res.render('view',{topics:files, title :id, description:data});
        })
        }
        else    {
        res.render('view',{topics : files});
        }
    })
});

app.post('/topic/success', function(req,res)    {
    var title = req.body.title;
    var description = req.body.description;
    fs.writeFile('data/' + title, description , function(err)  {
        if(err) {
            res.status(500).send('Internal Server Error');
        }
        res.redirect('/topic/'+ title);
    }) 
});

app.listen(3000, function(req, res)     {
    console.log("Connect Port 3000!")
});