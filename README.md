# connect-mongo-soajs
[![Build Status](https://travis-ci.org/soajs/connect-mongo-soajs.svg?branch=master)](https://travis-ci.org/soajs/connect-mongo-soajs)
[![Coverage Status](https://coveralls.io/repos/soajs/connect-mongo-soajs/badge.png)](https://coveralls.io/r/soajs/connect-mongo-soajs)
[![NPM version](https://badge.fury.io/js/connect-mongo-soajs.svg)](http://badge.fury.io/js/connect-mongo-soajs)

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
The dbConfig object looks like this:

    var dbConfig =  {
        'name' : "",
        'prefix' : "",
        'servers' : [{host : "", port : ""} ...],
        'credentials' : {username : "", password : ""},
        'URLParam' : { },
        'extraParam' : {db : {}, server : {}, replSet : {}, mongos: {}},
        'store': {},
        'collection': "sessions",
        'stringify': false,
        'expireAfter': 1000 * 60 * 60 * 24 * 14 // 2 weeks
    }
For a full reference regarding **URLParam** & **extraParam** please check out [mongodb website](http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connect)

Here is an example of dbConfig object:

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

## A simple example

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
    ...


## Full reference for **URLParam** & **extraParam**
Below is a full configuration object, but Please check out [mongodb website](http://mongodb.github.io/node-mongodb-native/)

    "URLParam": {
        "replicaSet": "rs",
        "ssl": false,
        "connectTimeoutMS": 0,
        "socketTimeoutMS": 0,
        "maxPoolSize": 5,
        "w": "majority",
        "wtimeoutMS": 0,
        "journal": false,
        "fsync": false,
        "authSource": null,
        "slaveOk": false,
        "readPreference": "primary",
        "readPreferenceTags": "TAG"
    },
    "extraParam": {
        "db": {
            "w": "majority",
            "wtimeout": 0,
            "fsync": false,
            "journal": false,
            "readPreference": "primary",
            "native_parser": true,
            "forceServerObjectId": false,
            "pkFactory": {},
            "serializeFunctions": false,
            "raw": false,
            "recordQueryStats": false,
            "retryMiliSeconds": 5000,
            "numberOfRetries": 5,
            "bufferMaxEntries": 0
        },
        "server": {
            "readPreference": "primary",
            "ssl": false,
            "slaveOk": false,
            "poolSize": 1,
            "socketOptions": {noDelay": false, "keepAlive": 1, "connectTimeoutMS": 0, "socketTimeoutMS": 0},
            "logger": null,
            "autoReconnect": true,
            "disableDriverBSONSizeCheck": false
        },
        "replSet": {
            "ha": true,
            "haInterval": 2000,
            "reconnectWait": 1000,
            "retries": 30,
            "rs_name": "rs",
            "socketOptions": null,
            "readPreference": "primary",
            "strategy": null,
            "secondaryAcceptableLatencyMS": 15,
            "connectArbiter": false

        },
        "mongos": {
            "socketOptions": null,
            "ha": true,
            "haInterval": 2000
        }
    }