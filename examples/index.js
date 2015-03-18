'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
//var MongoStore = require('connect-mongo-soajs')(session);
var MongoStore = require('../lib/index.js')(session);
var config = require ("./config");

var app = express();

app.use(cookieParser(config.cookieConfig.secret));

config.sessionConfig.store = new MongoStore(config.dbConfig);
app.use(session(config.sessionConfig));

app.get ("/store", function (req, res, next){
    req.session.myservice = req.query;
    res.json ({"result":true, "stored": req.query});
});

app.get ("/print", function (req, res, next){
    res.json ({"result":true, "stored": req.session.myservice});
});

app.listen(3000, function (err) {
    if (err)
        console.log (err);
});