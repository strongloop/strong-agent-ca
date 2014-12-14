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
}

inherits(Collector, EventEmitter);

Collector.prototype.collect = collect;
Collector.prototype.dump = dump;

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
