'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _financialCalculator = require('./server/financialCalculator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use(_bodyParser2.default.json());

app.get("/", function (req, res) {
  res.sendFile(_path2.default.join(__dirname + '/client/index.html'));
});

app.post("/calculate", function (req, res) {
  (0, _financialCalculator.handler)(req, res);
});

app.listen(3000, function () {
  console.log("Listening on port 3000");
});