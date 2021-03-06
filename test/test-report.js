// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: strong-agent-ca
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

var tap = require('tap');
var http = require('http');
var Reporter = require('../lib/reporter');
var concat = require('concat-stream');

tap.test('reporter.collect', function(t) {
  var metricsPath = 'testStats';
  var collected = {
    'h.p.a.counter': [1, 1],
    'h.p.b.average': [2, 3],
    'h.p.c.gauge': [5, 8],
  };
  var expectedReport = {
    metrics: [
      { type: 'IntCounter', name: 'testStats|h|p|a:counter', value: 1 },
      { type: 'IntCounter', name: 'testStats|h|p|a:counter', value: 1 },
      { type: 'IntAverage', name: 'testStats|h|p|b:average', value: 2 },
      { type: 'IntAverage', name: 'testStats|h|p|b:average', value: 3 },
      { type: 'IntCounter', name: 'testStats|h|p|c:gauge', value: 5 },
      { type: 'IntCounter', name: 'testStats|h|p|c:gauge', value: 8 },
    ],
  };

  var epAgent = http.createServer(function(req, res) {
    req.pipe(concat(function(body) {
      t.equal(req.url, '/apm/metricFeed');
      t.deepEqual(JSON.parse(body), expectedReport);
      res.end();
      epAgent.close();
    }));
  });

  epAgent.listen(0, function() {
    new Reporter({
      port: epAgent.address().port,
      metricsPath: metricsPath
    }).prepare(collected);
  });
  epAgent.on('close', t.end);
});
