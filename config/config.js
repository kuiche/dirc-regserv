var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'distirc-hashserv'
    },
    port: 3000,
    db: 'mongodb://localhost/distirc-hashserv-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'distirc-hashserv'
    },
    port: 3000,
    db: 'mongodb://localhost/distirc-hashserv-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'distirc-hashserv'
    },
    port: 3000,
    db: 'mongodb://localhost/distirc-hashserv-production'
  }
};

module.exports = config[env];
