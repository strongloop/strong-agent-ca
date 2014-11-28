var tap = require('tap');
var Collector = require('../lib/collector');

tap.test('Collector.collect', function(t) {
  var collector = new Collector({interval: 500});

  collector.once('metrics', verifyMetrics);
  collector.collect('h.p.a.counter', 1);
  collector.collect('h.p.b.average', 2);
  collector.collect('h.p.c.gauge', 3);

  function verifyMetrics(metrics) {
    t.deepEqual(metrics, {
      'h.p.a.counter': [1],
      'h.p.b.average': [2],
      'h.p.c.gauge': [3],
    }, 'collector aggregates metrics');
    collector.stop();
    t.end();
  }
});
