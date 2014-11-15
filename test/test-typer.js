var test = require('tap').test;
var getType = require('../lib/metric').getType;

test('metric.getType', function(t) {
  t.equal(getType('tiers.54.191.244.236_out.average'), 'IntAverage',
          'tiers averages are IntAverages');
  t.equal(getType('loop.max'), 'IntAverage',
          'max values are IntAverage');
  t.equal(getType('loop.count'), 'IntCounter',
          'loop.count is IntCounter');
  t.end();
});
