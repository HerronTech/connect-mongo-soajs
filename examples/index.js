'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
//var MongoStore = require('connect-mongo-soajs')(session);
var MongoStore = require('../lib/index.js')(session);
var config = require("./config");

var app = express();

app.use(cookieParser(config.cookieConfig.secret));

config.sessionConfig.store = new MongoStore(config.dbConfig);
app.use(session(config.sessionConfig));

app.get("/store", function (req, res, next) {
    req.session.myservice = req.query;
    res.json({"result": true, "stored": req.query});
});

app.get("/print", function (req, res, next) {
    res.json({"result": true, "stored": req.session.myservice});
});

app.get("/length", function (req, res, next) {
    req.sessionStore.length(function (err, data) {
        res.json({"result": true, "length": data});
    });
});

app.get("/destroy", function (req, res, next) {
    req.sessionStore.destroy(req.session.id, function (err, data) {
        res.json({"result": true, "destroy": data});
    });
});

app.get("/clear", function (req, res, next) {
    req.sessionStore.clear(function (err, data) {
        res.json({"result": true, "clear": data});
    });
});

app.listen(3000);