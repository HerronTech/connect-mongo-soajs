'use strict';

var Mongo = require('./mongo');
var util = require('util');

/**
 * 
 * @type {{name: string, prefix: string, servers: *[], credentials: null, URLParam: {connectTimeoutMS: number, socketTimeoutMS: number, maxPoolSize: number, w: number, wtimeoutMS: number, slaveOk: boolean}, extraParam: {db: {native_parser: boolean, bufferMaxEntries: number}, server: {}}, store: {}, collection: string, stringify: boolean, expireAfter: number}}
 */
var defaultOptions = {
    "name": "sessionDB",
    "prefix": "",
    "servers": [
        {"host": "127.0.0.1", "port": 27017}
    ],
    "credentials": null,
    "URLParam": {
        "connectTimeoutMS": 0,
        "socketTimeoutMS": 0,
        "maxPoolSize": 5,
        "w": 1,
        "wtimeoutMS": 0,
        "slaveOk": true
    },
    "extraParam": {
        "db": {
            "native_parser": true,
            "bufferMaxEntries": 0
        },
        "server": {
        }
    },
    'store': {},
    "collection": "sessions",
    'stringify': false,
    'expireAfter': 1000 * 60 * 60 * 24 * 14 // 2 weeks
};

/**
 *
 * @param connect
 * @returns {MongoStore}
 */
module.exports = function (connect) {
    var Store = connect.Store || connect.session.Store;

    /**
     * Initialize MongoStore with the given `options`.
     *
     * @param {Object} options
     */

    function MongoStore(options) {
        options = options || {};

        for (var property in defaultOptions) {
            if (defaultOptions.hasOwnProperty(property)) {
                if (!options.hasOwnProperty(property) || (typeof defaultOptions[property] !== typeof options[property]))
                    options[property] = defaultOptions[property];
            }
        }

        Store.call(this, options.store);

        var dbProperties = ["name", "prefix", "servers", "credentials", "URLParam", "extraParam"];
        var dbPropertiesLen = dbProperties.length;
        var dbOptions = {};
        for (var i = 0; i < dbPropertiesLen; i++)
            dbOptions[dbProperties[i]] = options[dbProperties[i]];

        this.mongo = new Mongo(dbOptions);
        this.mongo.ensureIndex(options.collection, {expires: 1}, {expireAfterSeconds: 0}, function (err, result) {
            if (err)
                throw new Error('Error setting TTL index on collection : ' + options.collection + ' <' + err + '>');
        });

        this._options = {
            "collection": options.collection,
            "stringify": options.stringify,
            "expireAfter": options.expireAfter
        };
    }

    /**
     * Inherit from `Store`.
     */
    util.inherits(MongoStore, Store);

    /**
     * Attempt to fetch session by the given `sid`.
     *
     * @param {String} sid
     * @param {Function} cb
     */
    MongoStore.prototype.get = function (sid, cb) {
        var self = this;
        this.mongo.findOne(self._options.collection, {_id: sid}, function (err, session) {
            if (err)
                return cb(err);
            if (!session)
                return cb();
            if (!session.expires || new Date < session.expires)
                return cb(null, deSerialize(self._options.stringify, session.session));
            self.destroy(sid, cb);
        });
    };

    /**
     * Commit the given `session` object associated with the given `sid`.
     *
     * @param {String} sid
     * @param {Object} session
     * @param {Function} cb
     */
    MongoStore.prototype.set = function (sid, session, cb) {
        var self = this;
        var expiryDate = (session && session.cookie && session.cookie._expires) ? (new Date(session.cookie._expires)) : newDateFromFuture(self._options.expireAfter);
        var s = {
            '_id': sid,
            'session': serialize(self._options.stringify, session),
            'expires': expiryDate
        };
        var filter = {'_id': sid};
        this.mongo.update(self._options.collection, filter, s, {'upsert': true, 'safe': true}, function (err, data) {
            return cb(err, data);
        });
    };

    /**
     * Destroy the session associated with the given `sid`.
     *
     * @param {String} sid
     * @param {Function} cb
     */
    MongoStore.prototype.destroy = function (sid, cb) {
        this.mongo.remove(this._options.collection, {_id: sid}, cb);
    };

    /**
     * Fetch number of sessions.
     *
     * @param {Function} cb
     */
    MongoStore.prototype.length = function (cb) {
        this.mongo.count(this._options.collection, {}, cb);
    };

    /**
     * Clear all sessions.
     *
     * @param {Function} cb
     */
    MongoStore.prototype.clear = function (cb) {
        this.mongo.dropCollection(this._options.collection, cb);
    };

    return MongoStore;
};

/**
 * Returns a data in the future.
 *
 * @param {Date} offset
 * @returns {Date}
 */
function newDateFromFuture(offset) {
    return new Date(Date.now() + offset);
}

/**
 * Return String or Object based on the stringify param.
 *
 * @param {Boolean} stringify
 * @param {Object} obj
 * @returns {*}
 */
function serialize(stringify, obj) {
    if (stringify)
        return JSON.stringify(obj);
    return obj;
}

/**
 * Return String or Object based on the stringify param.
 *
 * @param {Boolean} stringify
 * @param (String} str
 * @returns {*}
 */
function deSerialize(stringify, str) {
    if (stringify)
        return JSON.parse(str);
    return str;
}
