// Copyright (c) 2014-2015 StrongLoop

var tap = require('tap');
var http = require('http');
var Reporter = require('../lib/reporter');
var concat = require('concat-stream');

tap.test('reporter.collect', function(t) {
  var appName = 'AWESOME_TEST_APP';
  var collected = { 'a.counter': [1] };
  var expandedNameRX = /^StrongLoop\|[^|]+\|AWESOME_TEST_APP\|a:counter$/;

  var epAgent = http.createServer(function(req, res) {
    req.pipe(concat(function(body) {
      var name = JSON.parse(body).metrics[0].name;
      t.assert(expandedNameRX.test(name), 'appName part of metric path');
      res.end();
      epAgent.close();
    }));
  });

  epAgent.listen(0, function() {
    new Reporter({
      port: epAgent.address().port,
      appName: appName,
    }).prepare(collected);
  });
  epAgent.on('close', t.end);
});
