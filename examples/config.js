'use strict';

module.exports = {
    "cookieConfig":{
      "secret" : "this is your cookie secrert shhhhh"
    },
    "sessionConfig" :{
        "name": "myAppId",
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
            "maxPoolSize": 5
        },
        "extraParam": {
            "db": {
                "bufferMaxEntries": 0
            }
        },
        "collection": "sessions",
        'stringify': false,
        'expireAfter': 1000 * 60 * 60 * 24 * 14 // 2 weeks
    }
};