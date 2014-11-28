var Collector = require('./lib/collector');
var Reporter = require('./lib/reporter');

module.exports = exports = simple;
exports.Reporter = Reporter;
exports.Collector = Collector;

function simple(opts) {
  // Generates POST request and submits to EP Agent
  var reporter = new Reporter(opts);

  // TODO: replace collector with simpler transform and forward
  //       function once strong-agent has a bulk metrics API
  var collector = new Collector(opts);
  collector.on('metrics', reporter.prepare.bind(reporter));
  return collector.collect.bind(collector);
}
