// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: strong-agent-ca
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

var fmt = require('util').format;
var test = require('tap').test;
var makeMetrics = require('../lib/metric');

test('metric:makeCaMetrics', function(t) {
  // jshint maxlen:120

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
    [ { type: 'IntCounter', name: 'loop|loop:minimum (ms)', value: 1 } ]);

  testTransform(['loop', 'loop.maximum', [ 1.12, 3.58, 13.21 ]],
    [ { type: 'IntCounter', name: 'loop|loop:maximum (ms)', value: 13 } ]);

  testTransform(['strong-agent@1.0.3', 'tiers.54.191.244.236_out.average', [137.833, 123.456, 432.123]],
    [
      { type: 'IntAverage', name: 'strong-agent@1.0.3|backends|54.191.244.236|out:average', value: 138 },
      { type: 'IntAverage', name: 'strong-agent@1.0.3|backends|54.191.244.236|out:average', value: 123 },
      { type: 'IntAverage', name: 'strong-agent@1.0.3|backends|54.191.244.236|out:average', value: 432 },
    ]);

  testTransform(['strong-agent@1.0.3', 'tiers.54.191.244.236:8080_out.average', [137.833, 123.456, 432.123]],
    [
      { type: 'IntAverage', name: 'strong-agent@1.0.3|backends|54.191.244.236-8080|out:average', value: 138 },
      { type: 'IntAverage', name: 'strong-agent@1.0.3|backends|54.191.244.236-8080|out:average', value: 123 },
      { type: 'IntAverage', name: 'strong-agent@1.0.3|backends|54.191.244.236-8080|out:average', value: 432 },
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

  testTransform(['relative', 'http.connection.count', [0, 3,2,-5, 5,-1] ],
    [
      { type: 'IntCounter', name: 'relative|http|connection:count', value: 0 },
      { type: 'IntCounter', name: 'relative|http|connection:count', value: 3 },
      { type: 'IntCounter', name: 'relative|http|connection:count', value: 5 },
      { type: 'IntCounter', name: 'relative|http|connection:count', value: 0 },
      { type: 'IntCounter', name: 'relative|http|connection:count', value: 5 },
      { type: 'IntCounter', name: 'relative|http|connection:count', value: 4 },
    ]);

  t.end();

  function testTransform(given, expected) {
    var actual = makeMetrics.apply(null, given);
    var description = fmt('transforms %s|%s properly', given[0], given[1]);
    t.deepEqual(actual, expected, description);
  }
});
