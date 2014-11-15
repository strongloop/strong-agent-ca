var debug = require('debug')('strong-agent-ca:reporter');
var http = require('http');
var os = require('os');

var makeMetric = require('./metric');
var concat = require('concat-stream');

module.exports = exports = Reporter;

function Reporter(opts) {
  if (!(this instanceof Reporter)) {
    return new Reporter(opts);
  }
  debug('Reporter(%j)', opts);

  opts = opts || {};
  this.host = opts.host || 'localhost';
  this.port = opts.port || 8080;
  this.metricsPath = opts.metricsPath || ('nodejsStats|' + os.hostname().split('.', 1)[0]);

  // provide a string matching how strong-agent filters collector requests
  if (this.port == 80)
    this.hostString = this.host;
  else
    this.hostString = this.host + ':' + this.port;
}

Reporter.prototype.prepare = prepare;
Reporter.prototype.report = report;
Reporter.prototype.reqOpts = reqOpts;

function prepare(raw) {
  debug('prepare(%j)', raw);
  var metrics = {
    metrics: [],
    // These must either not be set, or set to the exact values that
    // EPAgent is expecting.. I'm not sure what their actual purpose is.
    // host: os.hostname().split('.', 1)[0],
    // process: 'node-demo',
    // agent: 'NodeAgent',
  };
  for (var m in raw) {
    metrics.metrics.push(makeMetric(this.metricsPath, m, raw[m]));
  }
  process.nextTick(this.report.bind(this, metrics));
}

function report(metrics) {
  debug('report', metrics);
  var req = http.request(this.reqOpts());
  req.on('response', function(res) {
    res.pipe(concat(function(body) {
      try {
        body = JSON.parse(body);
      } catch (e) {}
      debug('EPAgent Response:', body);
    }));
  });
  req.on('error', function(err) {
    // TODO: proper error handling/logging
    debug('EPAgent Error:', err);
  });
  req.end(JSON.stringify(metrics));
  debug('Sent to EPAgent:', metrics);
}

function reqOpts() {
  return {
    hostname: this.host,
    port: this.port,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    path: '/apm/metricFeed',
    agent: false, // avoid instrumentation and app side effects
  };
}
