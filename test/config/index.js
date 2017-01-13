var config = {};

config.auth = {};
config.auth.basic = {'user': 'pass'};

config.custom = {};
config.custom.key = {};
config.custom.key.array = [{'another': 'password'}, {'user': 'pass'}];

config.custom.key.object = {'user': 'pass'};

module.exports = config;
