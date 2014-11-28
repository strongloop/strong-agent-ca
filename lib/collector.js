var debug = require('debug')('strong-agent-ca:collector');
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

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

  // ensure interval is an integer
  this.timer = setInterval(this.dump.bind(this), this.interval|0);
  // ensure we do not keep the event loop alive if everything else finishes
  this.timer.unref();
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
    this.store[k] = [];
  }
  this.emit('metrics', copy);
}
