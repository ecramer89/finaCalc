'use strict';

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var _require = require('./server/financialCalculator'),
    calculate = _require.calculate;

var app = express();

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true })); //extended is only required if we anticipate having deeply nested objects.
//you should delete it if that won't be the case

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.post("/calculate", function (req, res) {
  calculate(req, res);
});

app.listen(3000, function () {
  console.log("Listening on port 3000");
});