var test = require('tap').test;
var getName = require('../lib/metric').getName;

test('metric.getName', function(t) {
  t.equal(getName('tiers.54.191.244.236_out.average', 'PREFIX'),
          'PREFIX|backends|tiers|54.191.244.236|out:average',
          'treats outbound http requests as backend');
  t.equal(getName('tiers.54.191.244.236_in.average', 'PREFIX'),
          'PREFIX|backends|tiers|54.191.244.236|in:average',
          'treats outbound http responses as backend');
  t.equal(getName('tiers.54.191.244.236:8080_in.average', 'PREFIX'),
          'PREFIX|backends|tiers|54.191.244.236-8080|in:average',
          'translates separators to -');
  t.end();
});
