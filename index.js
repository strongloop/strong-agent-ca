var Collector = require('./lib/collector');
var Reporter = require('./lib/reporter');

module.exports = exports = simple;
exports.Reporter = Reporter;
exports.Collector = Collector;

function simple(opts) {
  var reporter = new Reporter(opts);
  var collector = new Collector(opts);
  var adapter = collector.collect.bind(collector);
  adapter.stop = collector.stop.bind(collector);
  collector.on('metrics', reporter.prepare.bind(reporter));
  return adapter;
}
