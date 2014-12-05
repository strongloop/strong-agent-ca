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

  testTransform(['strong-agent@1.0.3', 'tiers.54.191.244.236_out.average', [137.833, 123.456, 432.123]],
    [
      { type: 'IntAverage', name: 'strong-agent@1.0.3|backends|tiers|54.191.244.236|out:average', value: 138 },
      { type: 'IntAverage', name: 'strong-agent@1.0.3|backends|tiers|54.191.244.236|out:average', value: 123 },
      { type: 'IntAverage', name: 'strong-agent@1.0.3|backends|tiers|54.191.244.236|out:average', value: 432 },
    ]);

  testTransform(['strong-agent@1.0.3', 'tiers.54.191.244.236:8080_out.average', [137.833, 123.456, 432.123]],
    [
      { type: 'IntAverage', name: 'strong-agent@1.0.3|backends|tiers|54.191.244.236-8080|out:average', value: 138 },
      { type: 'IntAverage', name: 'strong-agent@1.0.3|backends|tiers|54.191.244.236-8080|out:average', value: 123 },
      { type: 'IntAverage', name: 'strong-agent@1.0.3|backends|tiers|54.191.244.236-8080|out:average', value: 432 },
    ]);

  testTransform(['strong-agent@1.1.x', '54.191.244.236:8080.average', [139.866, 130.123, 140.532]],
    [
      { type: 'IntAverage', name: 'strong-agent@1.1.x|backends|54.191.244.236-8080:average', value: 140 },
      { type: 'IntAverage', name: 'strong-agent@1.1.x|backends|54.191.244.236-8080:average', value: 130 },
      { type: 'IntAverage', name: 'strong-agent@1.1.x|backends|54.191.244.236-8080:average', value: 141 },
    ]);

  testTransform(['strong-agent@1.1.x', '54.191.244.236.average', [139.866, 130.123, 140.532]],
    [
      { type: 'IntAverage', name: 'strong-agent@1.1.x|backends|54.191.244.236:average', value: 140 },
      { type: 'IntAverage', name: 'strong-agent@1.1.x|backends|54.191.244.236:average', value: 130 },
      { type: 'IntAverage', name: 'strong-agent@1.1.x|backends|54.191.244.236:average', value: 141 },
    ]);

  t.end();

  function testTransform(given, expected) {
    var actual = makeMetrics.apply(null, given);
    var description = fmt('transforms %s|%s properly', given[0], given[1]);
    t.deepEqual(actual, expected, description);
  }
});
