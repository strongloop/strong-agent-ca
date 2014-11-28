var fmt = require('util').format;
var test = require('tap').test;
var makeMetrics = require('../lib/metric');

test('metric:makeCaMetrics', function(t) {

  testTransform(['ints', 'h.p.a.counter', [1,2,3,4]],
    [
      { type: 'IntCounter', name: 'ints|h|p|a:counter', value: 1 },
      { type: 'IntCounter', name: 'ints|h|p|a:counter', value: 2 },
      { type: 'IntCounter', name: 'ints|h|p|a:counter', value: 3 },
      { type: 'IntCounter', name: 'ints|h|p|a:counter', value: 4 },
    ]);

  testTransform(['floats', 'h.p.a.avg', [ 1.12, 3.58, 13.21 ]],
    [
      { type: 'IntCounter', name: 'floats|h|p|a:avg', value: 1 },
      { type: 'IntCounter', name: 'floats|h|p|a:avg', value: 4 },
      { type: 'IntCounter', name: 'floats|h|p|a:avg', value: 13 },
    ]);

  testTransform(['loop', 'loop.minimum', [ 1.12, 3.58, 13.21 ]],
    [ { type: 'IntCounter', name: 'loop|loop:minimum (µs)', value: 1120 } ]);

  testTransform(['loop', 'loop.maximum', [ 1.12, 3.58, 13.21 ]],
    [ { type: 'IntCounter', name: 'loop|loop:maximum (µs)', value: 13210 } ]);

  t.end();

  function testTransform(given, expected) {
    var actual = makeMetrics.apply(null, given);
    var description = fmt('transforms %s|%s properly', given[0], given[1]);
    t.deepEqual(actual, expected, description);
  }
});
