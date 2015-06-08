'use strict'

var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Entry = mongoose.model('Entry'),
  crypto = require('crypto'),
  tokenLength = 16
;

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  var stream = Entry.find({}).lean().stream({transform: Entry.public}),
    data = []
  ;

  stream.on('data', function (entry) {
    data.push(entry);
  }).on('end', function () {
    res.json(data);
  }).on('error', function () {
    res.error();
  });
});

router.get('/:key([a-zA-Z0-9]+)', function (req, res, next) {
  Entry.findOne({key: req.params.key}).exec(function (err, entry) {
    if (err) return next(err);
    if (!entry) return next();
    res.json(entry.public());
  });
});

router.post('/:key([a-zA-Z0-9]+)', create);
router.get('/:key([a-zA-Z0-9]+)/create', create);

router.delete('/:key([a-zA-Z0-9]+)', del);
router.get('/:key([a-zA-Z0-9]+)/delete', del);

router.put('/:key([a-zA-Z0-9]+)', put);
router.get('/:key([a-zA-Z0-9]+)/update', put);

function create(req, res, next) {
  if (!req.query.value) {
    throw Error('value is a required field');
  }

  crypto.randomBytes(tokenLength, function(ex, buf) {
    var token = buf.toString('hex');

    Entry.create({
      key: req.params.key,
      value: req.query.value,
      token: token
    }, function (err, entry) {
      if (err) return next(err);
      else res.json(entry.private());
    });
  });
}

function del(req, res, next) {
  var token = req.query.token, error;

  if (!token) {
    error = new Error('No.');
    error.status = 403;
    return next(error);
  }

  Entry.findOne({key: req.params.key}).exec(function (err, entry) {
    if (err) return next(err);

    if (entry.token !== token) {
      error = new Error('No.');
      error.status = 403;
      return next(error);
    }

    return res.json([]);
  });
}

function put(req, res, next) {

  Entry.findOne({key: req.params.key}).exec(function (err, entry) {
    var token = req.query.token;

    if (err) return next(err);

    if (entry.token !== token) {
      error = new Error('No.');
      error.status = 403;
      return next(error);
    }

    crypto.randomBytes(tokenLength, function(ex, buf) {
      var newToken = buf.toString('hex');

      entry.value = req.query.value;
      entry.token = newToken;

      entry.save();

      return res.json(entry.private());
    });
  });
}
