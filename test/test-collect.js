// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: strong-agent-ca
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

var tap = require('tap');
var Collector = require('../lib/collector');

tap.test('Collector.collect', function(t) {
  var collector = new Collector();

  collector.once('metrics', verifyMetrics1);
  collector.collect('h.p.a.counter', 1);
  collector.collect('h.p.b.average', 2);
  collector.collect('h.p.c.gauge', 3);
  collector.collect('http.connection.count', 3);
  collector.collect('http.connection.count', -2);
  collector.collect('http.connection.count', 1);
  collector.collect('http.connection.count', 4);
  collector.dump();

  function verifyMetrics1(metrics) {
    t.deepEqual(metrics, {
      'h.p.a.counter': [1],
      'h.p.b.average': [2],
      'h.p.c.gauge': [3],
      'http.connection.count': [3, -2, 1, 4],
    }, 'collector aggregates metrics');
    collector.once('metrics', verifyMetrics2);
    collector.dump();
  }
  function verifyMetrics2(metrics) {
    t.deepEqual(metrics, {
      'h.p.a.counter': [],
      'h.p.b.average': [],
      'h.p.c.gauge': [],
      'http.connection.count': [6],
    }, 'collector resets metrics appropriately');
    t.end();
  }
});
