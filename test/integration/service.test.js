"use strict";
var assert = require('assert');
var request = require("request");
var helper = require("../helper.js");
var service = null;
var cookie = null;
var cookie2 = null;

function executeMyRequest(params, apiPath, method, cb) {
	requester(apiPath, method, params, function(error, body, response) {
		assert.ifError(error);
		assert.ok(body);
		return cb(body, response);
	});

	function requester(apiName, method, params, cb) {
		var options = {
			uri: 'http://localhost:3000/' + apiName,
			headers: {
				'Content-Type': 'application/json'
			},
			json: true
		};

		if(params.headers) {
			for(var h in params.headers) {
				if(params.headers.hasOwnProperty(h)) {
					options.headers[h] = params.headers.h;
				}
			}
		}

		if(params.form) {
			options.body = params.form;
		}

		if(params.qs) {
			options.qs = params.qs;
		}

        if(params.cookie){
            options.headers.cookie = params.cookie;
        }

		request[method](options, function(error, response, body) {
			assert.ifError(error);
			assert.ok(body);
			return cb(null, body, response);
		});
	}
}


describe("connect mongo soajs test", function() {
	var expDateValue = new Date().toISOString();
	before(function(done) {
        service = helper.requireModule('./examples/index');
		setTimeout(function() {			
			done();
		}, 1000);			
	});

    describe("clear session - test", function() {
        it('success ', function(done) {
            var params = {};
            executeMyRequest(params, 'clear', 'get', function(body, response) {
                assert.ok(body);
                assert.equal(body.result, true);
                assert.ok(body.clear);
                done();
            });
        });
    });
	describe("store in session - test", function() {
		it('success ', function(done) {
			var params = {
				qs: {
					"name": "antoine"
				}				
			};
			executeMyRequest(params, 'store', 'get', function(body, response) {
				assert.ok(body);
				assert.equal(body.result, true);
                cookie = response.headers['set-cookie'];
                assert.ok(cookie);
                cookie = cookie[0].split(';');
                cookie = cookie[0];
				done();
			});
		});
	});
    describe("print stored session - test", function() {
        it('success ', function(done) {
            var params = {
                cookie: cookie
            };
            executeMyRequest(params, 'print', 'get', function(body, response) {
                assert.ok(body);
                assert.equal(body.result, true);
                assert.equal(body.stored.name, "antoine");
                done();
            });
        });
    });
    describe("store in same session - test", function() {
        it('success ', function(done) {
            var params = {
                qs: {
                    "name": "john"
                },
                cookie: cookie
            };
            executeMyRequest(params, 'store', 'get', function(body, response) {
                assert.ok(body);
                assert.equal(body.result, true);
                done();
            });
        });
    });
    describe("print stored session - test", function() {
        it('success ', function(done) {
            var params = {
                cookie: cookie
            };
            executeMyRequest(params, 'print', 'get', function(body, response) {
                assert.ok(body);
                assert.equal(body.result, true);
                assert.equal(body.stored.name, "john");
                done();
            });
        });
    });
    describe("count stored session - test", function() {
        it('success ', function(done) {
            var params = {};
            executeMyRequest(params, 'length', 'get', function(body, response) {
                assert.ok(body);
                assert.equal(body.result, true);
                assert.equal(body.length, 1);
                done();
            });
        });
    });
    describe("destroy session - test", function() {
        it('success ', function(done) {
            var params = {
                cookie: cookie
            };
            executeMyRequest(params, 'destroy', 'get', function(body, response) {
                assert.ok(body);
                assert.equal(body.result, true);
                assert.equal(body.destroy, 1);
                done();
            });
        });
    });
    describe("print stored session - test", function() {
        it('success ', function(done) {
            var params = {
                cookie: cookie
            };
            executeMyRequest(params, 'print', 'get', function(body, response) {
                assert.ok(body);
                console.log(body);
                assert.equal(body.result, true);
                assert.equal(body.stored, undefined);
                done();
            });
        });
    });
});