var test = require('tap').test;
var valueMakerFor = require('../lib/metric').valueMakerFor;
var nameOf = require('../lib/metric').nameOf;

test('metric.valueMakerFor', function(t) {
  var loopMin = valueMakerFor('loop.minimum');
  var loopAvg = valueMakerFor('loop.average');
  var loopMax = valueMakerFor('loop.maximum');
  var loopCount = valueMakerFor('loop.count');

  t.equal(loopMin(0.0023), 2);
  t.equal(loopAvg(1.2345), 1235);
  t.equal(loopMax(1234.567890), 1234568);
  t.equal(loopCount(100), 100);

  t.equal(nameOf('loop.minimum', 'PRE'), 'PRE|loop:minimum (µs)');
  t.equal(nameOf('loop.average', 'PRE'), 'PRE|loop:average (µs)');
  t.equal(nameOf('loop.maximum', 'PRE'), 'PRE|loop:maximum (µs)');
  t.equal(nameOf('loop.count', 'PRE'), 'PRE|loop:count (ticks)');

  t.end();
});
