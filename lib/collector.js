var debug = require('debug')('strong-agent-ca:collector');
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var metric = require('./metric');

module.exports = exports = Collector;

function Collector(opts) {
  if (!(this instanceof Collector))
    return new Collector(opts);

  EventEmitter.call(this);

  this.store = {};
  this.interval = opts.interval || 15000;

  this.on('newListener', this.start.bind(this));
}

inherits(Collector, EventEmitter);

Collector.prototype.start = start;
Collector.prototype.stop = stop;
Collector.prototype.collect = collect;
Collector.prototype.dump = dump;

function start() {
  if (this.timer) {
    debug('already started');
    return;
  }
  debug('starting');
  var self = this;

  // Make sure our timer is offset from strong-agent's timer so that
  // we don't dump in the middle of collecting the metrics for the
  // current cycle. Make sure delay is an integer to avoid a bug in
  // some versions of node.
  var delay = Math.min(1000, this.interval/2) | 0;
  this.timer = setTimeout(startTimer, delay);
  this.timer.unref();

  function startTimer() {
    // ensure interval is an integer
    self.timer = setInterval(dump, self.interval|0);
    // ensure we do not keep the event loop alive if everything else finishes
    self.timer.unref();
  }

  function dump() {
    self.dump();
  }
}

function stop() {
  clearInterval(this.timer);
  this.timer = null;
}

function collect(name, value) {
  debug('collect(%j,%j)', name, value);
  this.store[name] = this.store[name] || [];
  this.store[name].push(value);
}

function dump() {
  var copy = JSON.parse(JSON.stringify(this.store));
  for (var k in this.store) {
    this.store[k] = metric.resetterOf(k)(this.store[k]);
  }
  this.emit('metrics', copy);
}
