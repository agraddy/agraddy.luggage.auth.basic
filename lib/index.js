var bomb = require('agraddy.error.bomb.auth.basic');
var config = require('agraddy.config');

var loaded = false;

config.on('loaded', function() {
	loaded = true;
});

var mod = function(input) {
	var type;
	var position;

	if(Array.isArray(input)) {
		type = 'array';
	} else if(typeof input == 'object') {
		type = 'object';
	} else if(typeof input == 'string') {
		type = 'config';
		position = input;
	} else {
		type = 'config';
		position = 'auth.basic';
	}

	var plugin = function(req, res, lug, cb) {
		var encoded;
		var decoded;
		var parts;
		var username;
		var password;
		var i;
		var pass = false;

		if(!req.headers['authorization']) {
			cb(bomb());
		} else {
			encoded = req.headers['authorization'].slice(req.headers['authorization'].indexOf(' ') + 1);
			decoded = new Buffer(encoded, 'base64').toString();
			parts = decoded.split(':');
			username = parts[0];
			password = parts[1];

			// Check for config first
			if(type == 'config') {
				if(loaded) {
					try {
						input = handleConfig();
						handleTypes(input);
					} catch(e) {
						// Bomb if the key does not exist
						cb(bomb());
					}
				} else {
					config.on('loaded', function() {
						try {
							input = handleConfig();
							handleTypes(input);
						} catch(e) {
							// Bomb if the key does not exist
							cb(bomb());
						}
					});
				}
			} else {
				handleTypes(input);
			}

		}

		function configLoop(config, keys) {
			if(keys.length == 1) {
				return config[keys[0]];
			} else {
				return configLoop(config[keys[0]], keys.slice(1));
			}
		}

		function handleConfig() {
			var keys = position.split('.');

			// Return the config value
			return configLoop(config, keys);
			
		}

		function handleTypes(input) {
			var type;

			if(Array.isArray(input)) {
				type = 'array';
			} else if(typeof input == 'object') {
				type = 'object';
			} else {
				// input does not appear to be an array or object
				type = 'fail';
			}

			if(type == 'object') {
				if(input[username] == password) {
					cb();
				} else {
					cb(bomb());
				}
			} else if(type == 'array') {
				for(i = 0; i < input.length; i++) {
					if(input[i][username] == password) {
						pass = true;
						break;
					}
				}
				if(!pass) {
					cb(bomb());
				} else {
					cb();
				}
			} else {
				cb(bomb());
			}
		}

	};

	return plugin;

}

module.exports = mod;
