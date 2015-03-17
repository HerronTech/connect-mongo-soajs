'use strict';

module.exports = {
    "cookieConfig":{
      "secret" : "this is your cookie secrert shhhhh"
    },
    "sessionConfig" :{
        "name": "soajsID",
        "secret": "this is your session secret shhhhhh",
        "cookie": {"path": '/', "httpOnly": true, "secure": false, "domain": "localhost", "maxAge": null},
        "resave": false,
        "saveUninitialized": false
    },
    "dbConfig": {
        "name": "appSession",
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
};