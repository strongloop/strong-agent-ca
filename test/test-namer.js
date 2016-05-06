// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: strong-agent-ca
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

var test = require('tap').test;
var nameOf = require('../lib/metric').nameOf;

test('metric.nameOf', function(t) {
  t.equal(nameOf('tiers.54.191.244.236_out.average', 'PREFIX'),
          'PREFIX|backends|54.191.244.236|out:average',
          'treats outbound http requests as backend');
  t.equal(nameOf('tiers.54.191.244.236_in.average', 'PREFIX'),
          'PREFIX|backends|54.191.244.236|in:average',
          'treats outbound http responses as backend');
  t.equal(nameOf('tiers.54.191.244.236:8080_in.average', 'PREFIX'),
          'PREFIX|backends|54.191.244.236-8080|in:average',
          'translates separators to -');
  t.equal(nameOf('tiers.54.191.244.236:8080_out.average', 'strong-agent@1.0.3'),
          'strong-agent@1.0.3|backends|54.191.244.236-8080|out:average',
          'translates separators to -');
  t.equal(nameOf('54.191.244.236:8080.average', 'strong-agent@1.1.x'),
          'strong-agent@1.1.x|backends|54.191.244.236-8080:average',
          'translates ip addresses appropriately');
  t.end();
});
