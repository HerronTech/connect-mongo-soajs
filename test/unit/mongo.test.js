"use strict";
var assert = require('assert');
var helper = require("../helper.js");
var soajsMongo = helper.requireModule('./lib/mongo');

describe("testing connection", function() {
	var mongo;

	it("invalid credentials all requests should fail", function(done) {
		var dbConfig = {
			"name": 'soajs_test_db',
			"prefix": "soajs_test_",
			"servers": [
				{
					"host": "127.0.0.1",
					"port": "27017"
				}
			],
			"credentials": {
				'username': 'admin',
				'password': 'admin'
			},
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

		mongo = new soajsMongo(dbConfig);
		mongo.findOne('myCollection', {}, function(error, response) {
			assert.ok(error);
			assert.ok(!response);
			assert.ok(error.message);
			done();
		});
	});

	it("testing with no db name", function(done) {
		var dbConfig = {
			"name": '',
			"prefix": "soajs_test_",
			"servers": [
				{
					"host": "127.0.0.1",
					"port": "27017"
				}
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

		mongo = new soajsMongo(dbConfig);
		mongo.findOne('myCollection', {}, function(error) {
			assert.ok(error);
			assert.equal(error.message, 'Unable to build needed url for mongo to connect.');
			console.log(error);
			done();
		});
	});
});

describe("TESTING soajs.mongo", function() {
	var mongo = null;
	before(function(done) {
		var dbConfig = {
			"name": 'appSession',
			"prefix": "",
			"servers": [
				{"host": "127.0.0.1", "port": "27017"}
			],
			"credentials": {},
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
			}
		};

		mongo = new soajsMongo(dbConfig);
		done();
	});

	describe("testing ensure index", function() {

		it("fail - no collectionName", function(done) {
			mongo.ensureIndex(null, null, null, function(error) {
				assert.ok(error);
				assert.equal(error.message, 'collection name is required.');
				done();
			});
		});

		it('success - all working', function(done) {
			mongo.ensureIndex("myCollection", {'username': 1}, null, function(error, response) {
				assert.ifError(error);
				assert.ok(response);
				done();
			});
		});
	});

	describe("testing update", function() {
		it("fail - no collectionName", function(done) {
			mongo.update(null, function(error) {
				assert.ok(error);
				assert.equal(error.message, 'collection name is required.');
				done();
			});
		});

		it('success - all working', function(done) {
			mongo.update("myCollection", {'a': 'b'}, {$set: {'a': 'b'}}, function(error, response) {
				assert.ifError(error);
				assert.equal(response, 0);
				done();
			});
		});
	});

	describe("testing find one", function() {
		it("fail - no collectionName", function(done) {
			mongo.findOne(null, function(error) {
				assert.ok(error);
				assert.equal(error.message, 'collection name is required.');
				done();
			});
		});

		it('success - all working', function(done) {
			mongo.findOne("myCollection", {'a': 'c'}, function(error, response) {
				assert.ifError(error);
				console.log(response);
				done();
			});
		});
	});

	describe("testing count", function() {
		it("fail - no collectionName", function(done) {
			mongo.count(null, null, function(error) {
				assert.ok(error);
				assert.equal(error.message, 'collection name is required.');
				done();
			});
		});

		it('success - all working', function(done) {
			mongo.count("myCollection", {'a': 'c'}, function(error, response) {
				assert.ifError(error);
				assert.equal(response, 0);
				done();
			});
		});

		it('success - all working', function(done) {
			mongo.count("myCollection", {'a': 'b'}, function(error, response) {
				assert.ifError(error);
				assert.equal(response, 0);
				done();
			});
		});
	});

	describe("testing remove", function() {
		it("fail - no collectionName", function(done) {
			mongo.remove(null, null, function(error) {
				assert.ok(error);
				assert.equal(error.message, 'collection name is required.');
				done();
			});
		});

		it('success - all working', function(done) {
			mongo.remove("myCollection", {'a': 'c'}, function(error, response) {
				assert.ifError(error);
				done();
			});
		});
	});

	describe("testing drop collection", function() {
		it("fail - no collectionName", function(done) {
			mongo.dropCollection(null, function(error) {
				assert.ok(error);
				assert.equal(error.message, 'collection name is required.');
				done();
			});
		});

		it('success - all working', function(done) {
			mongo.dropCollection("myCollection", function(error, response) {
				assert.ifError(error);
				done();
			});
		});
	});

});