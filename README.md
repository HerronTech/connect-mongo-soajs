# connect-mongo-soajs
### MongoDB session store for Express and Connect
Fed up from not being able to find a decent mongo store with full control over mongo configuration including replica set support and not face a race condition because mongo connections are not being handled the right way.

Connect-mongo-soajs is a store that gives you full control over mongo configuration. Enjoy an unleashed reliable mongo store :)

This is a standanlone version of soajs connect mongo. You can simply use it as a standalone package as described below.

## Installation

    $ npm install connect-mongo-soajs

## Usage

    var session = require('express-session');
    var MongoStore = require('connect-mongo-soajs')(session);
    var store = new MongoStore(dbConfig)

### dbConfig
    var dbConfig = {
        "name": "core_session",
        "prefix": "",
        "servers": [
            {
                "host": "127.0.0.1",
                "port": 27017
            }
        ],
        "credentials": null,
        "URLParam": {
            "connectTimeoutMS": 0,
            "socketTimeoutMS": 0,
            "maxPoolSize": 5,
            "wtimeoutMS": 0,
            "slaveOk": true
        },
        "extraParam": {
            "db": {
                "native_parser": true
            },
            "server": {
                "auto_reconnect": true
            }
        },
        'store': {},
        "collection": "sessions",
        'stringify': false,
        'expireAfter': 1000 * 60 * 60 * 24 * 14 // 2 weeks
    }

## Example

    var express = require('express');
    var session = require('express-session');
    var MongoStore = require('connect-mongo-soajs')(session);
    var app = express();

    var dbConfig = {
        "name": "core_session",
        "prefix": "",
        "servers": [
            {
                "host": "127.0.0.1",
                "port": 27017
            }
        ],
        "credentials": null,
        "URLParam": {
            "connectTimeoutMS": 0,
            "socketTimeoutMS": 0,
            "maxPoolSize": 5,
            "wtimeoutMS": 0,
            "slaveOk": true
        },
        "extraParam": {
            "db": {
                "native_parser": true
            },
            "server": {
                "auto_reconnect": true
            }
        },
        'store': {},
        "collection": "sessions",
        'stringify': false,
        'expireAfter': 1000 * 60 * 60 * 24 * 14 // 2 weeks
    }

    var sessionConfig = {
        "name": "soajsID",
        "secret": "this is your session secret shhhhhh",
        "cookie": {"path": '/', "httpOnly": true, "secure": false, "domain": "localhost", "maxAge": null},
        "resave": false,
        "saveUninitialized": false,
        "store" : new MongoStore(dbConfig)
    };

    app.use(session(sessionConfig));


For a full reference regarding dbConfig please check out [mongodb website](http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connect)



