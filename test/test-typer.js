var test = require('tap').test;
var typeOf = require('../lib/metric').typeOf;

test('metric.typeOf', function(t) {
  t.equal(typeOf('tiers.54.191.244.236_out.average'), 'IntAverage',
          'tiers averages are IntAverages');
  t.equal(typeOf('loop.max'), 'IntAverage',
          'max values are IntAverage');
  t.equal(typeOf('loop.count'), 'PerIntervalCounter',
          'loop.count is IntCounter');
  t.end();
});
