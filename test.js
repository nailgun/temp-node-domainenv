var express = require('express');
var envmiddleware = require('./connect-middleware');
var domainenv = require('./domainenv');
var profile = require('./domainenv-profile');
var app = express();

app.use(envmiddleware());
app.use(function (req, res, next) {
  var d = process.domain;
  d.profile = require('./perfcounter').start('Request');

  res.on('finish', function () {
      d.profile.stop();
      console.log(d.profile.result);
  });

  next();
});
app.use(express.logger('dev'));

app.get('/hello.txt', function(req, res) {
  var hw = profile.start('Send hello world');
  res.write('Hello World');
  hw.stop(); // TODO: force stop if not stopped
  res.end();
});

app.listen(3000);
console.log('Listening on port 3000');
