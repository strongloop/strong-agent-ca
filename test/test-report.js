var tap = require('tap');
var http = require('http');
var Reporter = require('../lib/reporter');
var concat = require('concat-stream')

tap.test('reporter.collect', function(t) {
  var metricsPath = 'testStats';
  var collected = {
    'h.p.a.counter': 1,
    'h.p.b.average': 2,
    'h.p.c.gauge': 3,
  };
  var expectedReport = {
    metrics: [
      { type: 'IntCounter', name: 'testStats|h|p|a:counter', value: 1 },
      { type: 'IntAverage', name: 'testStats|h|p|b:average', value: 2 },
      { type: 'IntCounter', name: 'testStats|h|p|c:gauge', value: 3 },
    ],
  };

  var epAgent = http.createServer(function(req, res) {
    req.pipe(concat(function(body) {
      t.equal(req.url, '/apm/metricFeed');
      t.deepEqual(JSON.parse(body), expectedReport);
      res.end();
      epAgent.close(t.end.bind(t));
    }));
  });

  epAgent.listen(0, function() {
    Reporter({
      port: epAgent.address().port,
      metricsPath: metricsPath
    }).prepare(collected);
  });
});
