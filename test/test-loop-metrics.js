// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: strong-agent-ca
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

var test = require('tap').test;
var valueMakerFor = require('../lib/metric').valueMakerFor;
var nameOf = require('../lib/metric').nameOf;

test('metric.valueMakerFor', function(t) {
  var loopMin = valueMakerFor('loop.minimum');
  var loopAvg = valueMakerFor('loop.average');
  var loopMax = valueMakerFor('loop.maximum');
  var loopCount = valueMakerFor('loop.count');

  t.equal(loopMin(0.0023), 0);
  t.equal(loopAvg(1.2345), 1);
  t.equal(loopMax(1234.567890), 1235);
  t.equal(loopCount(100), 100);

  t.equal(nameOf('loop.minimum', 'PRE'), 'PRE|loop:minimum (ms)');
  t.equal(nameOf('loop.average', 'PRE'), 'PRE|loop:average (ms)');
  t.equal(nameOf('loop.maximum', 'PRE'), 'PRE|loop:maximum (ms)');
  t.equal(nameOf('loop.count', 'PRE'), 'PRE|loop:count (ticks)');

  t.end();
});
