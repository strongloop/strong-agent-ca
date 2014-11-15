// Copyright (c) 2014, StrongLoop

// XXX: lodash is currently only used for memoize
var lodash = require('lodash');
var nameOf = lodash.memoize(translateName);
var typeOf = lodash.memoize(translateType);

module.exports = exports = makeCaMetric;
exports.getValue = valueOf;
exports.getName = nameOf;
exports.getType = typeOf;

// Turn prefix, name, value into a metric entry object
function makeCaMetric(prefix, name, value) {
  return {
    type: typeOf(name, value),
    name: nameOf(name, prefix),
    value: valueOf(name, value),
  };
}


// Values: EPAgent only support integers
function valueOf(name, value, path) {
  return value|0;
}


// Names: | separated path with : separator before value name

var TIERS_RX = /^(tiers)\.(.+)_(in|out).(average)$/;

function translateName(name, prefix) {
  if (TIERS_RX.test(name)) {
    name = tiersName(name);
  } else {
    name = simpleName(name);
  }
  return prefix + '|' + name;
}

function simpleName(name) {
  var parts = name.split('.').map(sanitizePart);
  name = [parts.slice(0, -1).join('|'), parts.slice(-1)].join(':');
  return name;
}

function tiersName(name) {
  var parts = TIERS_RX.exec(name).map(sanitizePart);
  var head = [ 'backends', parts[1], parts[2], parts[3] ].join('|');
  return [ head, parts[4] ].join(':');
}

function sanitizePart(str) {
  return str.replace(/[:|]/g, '-');
}


// Types: IntCounter, IntAverage, ...

var COUNT_RX = /\.count$/;
var TIMER_RX = /\.timer$/;
var AVG_RX = /\.(average|min|max)$/;

function translateType(name) {
  if (COUNT_RX.test(name)) {
    return 'IntCounter';
  } else if (AVG_RX.test(name)) {
    return 'IntAverage';
  } else if (TIERS_RX.test(name)) {
    return 'IntAverage';
  } else {
    return 'IntCounter';
  }
}
