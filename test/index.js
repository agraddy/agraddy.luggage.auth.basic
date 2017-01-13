process.chdir('test');
var tap = require('agraddy.test.tap')(__filename);

var mod = require('../');

noAuthPassed();

function noAuthPassed() {
	var req = {};
	var res = {};
	var lug = {};

	req.headers = {};

	mod({'user': 'pass'})(req, res, lug, function(err) {
		tap.assert.equal(typeof err.bomb, 'function', 'If the credentials are not passed, should pass a bomb error.');

		objectFail();
	});
}

function objectFail() {
	var req = {};
	var res = {};
	var lug = {};

	req.headers = {};
	req.headers['authorization'] = 'Basic dXNlcjpwYXNz'; // Basic: user:pass

	mod({'user': '!!!pass!!!'})(req, res, lug, function(err) {
		tap.assert.equal(typeof err.bomb, 'function', "Should fail if credentials don't match the passed in object.");

		objectPass();
	});
}

function objectPass() {
	var req = {};
	var res = {};
	var lug = {};

	req.headers = {};
	req.headers['authorization'] = 'Basic dXNlcjpwYXNz';

	mod({'user': 'pass'})(req, res, lug, function(err) {
		tap.assert.equal(typeof err, 'undefined', 'Should pass if credentials match the passed in object.');

		arrayFail();
	});
}

function arrayFail() {
	var req = {};
	var res = {};
	var lug = {};

	req.headers = {};
	req.headers['authorization'] = 'Basic dXNlcjpwYXNz'; // Basic: user:pass

	mod([{'another': 'password'}, {'user': '!!!pass!!!'}])(req, res, lug, function(err) {
		tap.assert.equal(typeof err.bomb, 'function', "Should fail if credentials don't match an object in the passed in array.");

		arrayPass();
	});
}

function arrayPass() {
	var req = {};
	var res = {};
	var lug = {};

	req.headers = {};
	req.headers['authorization'] = 'Basic dXNlcjpwYXNz'; // Basic: user:pass

	mod([{'another': 'password'}, {'user': 'pass'}])(req, res, lug, function(err) {
		tap.assert.equal(typeof err, 'undefined', 'Should pass if credentials match an object in the passed in array.');

		configFail();
	});
}

function configFail() {
	var req = {};
	var res = {};
	var lug = {};

	req.headers = {};
	req.headers['authorization'] = 'Basic dXNlcjpmYWls'; // Basic: user:fail

	mod()(req, res, lug, function(err) {
		tap.assert.equal(typeof err.bomb, 'function', "Should fail if credentials don't match the config.auth.basic object/array.");

		configPass();
	});
}

function configPass() {
	var req = {};
	var res = {};
	var lug = {};

	req.headers = {};
	req.headers['authorization'] = 'Basic dXNlcjpwYXNz'; // Basic: user:pass

	mod()(req, res, lug, function(err) {
		tap.assert.equal(typeof err, 'undefined', 'Should pass if credentials match the config.auth.basic object/array.');

		configBadKey();
	});
}

function configBadKey() {
	var req = {};
	var res = {};
	var lug = {};

	req.headers = {};
	req.headers['authorization'] = 'Basic dXNlcjpwYXNz'; // Basic: user:pass

	mod('config.does.not.exist')(req, res, lug, function(err) {
		tap.assert.equal(typeof err.bomb, 'function', "Should fail if config does not exist.");

		configCustomKeyArray();
	});
}

function configCustomKeyArray() {
	var req = {};
	var res = {};
	var lug = {};

	req.headers = {};
	req.headers['authorization'] = 'Basic dXNlcjpwYXNz'; // Basic: user:pass

	mod('custom.key.array')(req, res, lug, function(err) {
		tap.assert.equal(typeof err, 'undefined', 'Should pass if credentials match the custom.key.array array.');

		configCustomKeyObject();
	});
}

function configCustomKeyObject() {
	var req = {};
	var res = {};
	var lug = {};

	req.headers = {};
	req.headers['authorization'] = 'Basic dXNlcjpwYXNz'; // Basic: user:pass

	mod('custom.key.object')(req, res, lug, function(err) {
		tap.assert.equal(typeof err, 'undefined', 'Should pass if credentials match the custom.key.object object.');

		end();
	});
}


function end() {
}

