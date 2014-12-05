// Copyright (c) 2014, StrongLoop

// XXX: lodash is currently only used for memoize
var lodash = require('lodash');
var nameOf = lodash.memoize(translateName);
var typeOf = lodash.memoize(translateType);
var valueMakerFor = lodash.memoize(valueTranslator);
var reducerOf = lodash.memoize(valueReducer);

module.exports = exports = makeCaMetrics;
exports.valueMakerFor = valueMakerFor;
exports.nameOf = nameOf;
exports.reducerOf = reducerOf;
exports.typeOf = typeOf;

// Turn prefix, name, value into an Array of metric entry objects
function makeCaMetrics(prefix, rawName, rawValues) {
  var name = nameOf(rawName, prefix);
  var type = typeOf(rawName);
  var makeValue = valueMakerFor(rawName);
  var reducer = reducerOf(rawName);

  return reducer(rawValues).map(makeMetric);

  function makeMetric(value) {
    return {
      type: type,
      name: name,
      value: makeValue(value),
    };
  }
}


// Values: EPAgent only support integers
function valueTranslator(name) {
  if (/loop\.(minimum|average|maximum)/.test(name)) {
    return microSeconds;
  } else {
    return Math.round;
  }

  function microSeconds(value) {
    return Math.round(value * 1000);
  }
  function integer(value) {
    return Math.round(value);
  }
}

function valueReducer(name) {
  if (name === 'loop.minimum') return min;
  else if (name === 'loop.maximum') return max;
  else if (name === 'http.connection.count') return runningTotal;
  else return lodash.identity;

  function min(values) {
    return [Math.min.apply(null, values)];
  }
  function max(values) {
    return [Math.max.apply(null, values)];
  }
  // turn array of numbers into an array of running totals
  function runningTotal(values) {
    return values.slice(1).reduce(function(acc, v) {
      acc.push(v + acc[acc.length-1]);
      return acc;
    }, values.slice(0, 1));
  }
}


// Names: | separated path with : separator before value name

var TIERS_RX = /^(tiers)\.(.+)_(in|out)\.(average)$/;
var NEW_TIERS_RX = /^(\d+\.\d+\.\d+\.\d+(:\d+)?)\.(average)$/;

function translateName(name, prefix) {
  if (TIERS_RX.test(name)) {
    name = tiersName(name);
  } else if (NEW_TIERS_RX.test(name)) {
    name = newTiersName(name);
  } else if (/^loop\./.test(name)) {
    name = loopName(name);
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

function loopName(name) {
  var units;
  if (name === 'loop.count') {
    units = ' (ticks)';
  } else {
    units = ' (µs)';
  }
  return name.replace('.', ':') + units;
}

function tiersName(name) {
  var parts = TIERS_RX.exec(name).map(sanitizePart);
  var head = [ 'backends', parts[1], parts[2], parts[3] ].join('|');
  return [ head, parts[4] ].join(':');
}

function newTiersName(name) {
  var parts = NEW_TIERS_RX.exec(name).map(sanitizePart);
  var head = [ 'backends', parts[1] ].join('|');
  return [ head, parts[3] ].join(':');
}

function sanitizePart(str) {
  return str && str.replace(/[:|]/g, '-');
}


// Types: IntCounter, IntAverage, ...

var COUNT_RX = /\.count$/;
var TIMER_RX = /\.timer$/;
var AVG_RX = /\.(average|min|max)$/;

function translateType(name) {
  if (name === 'loop.count') {
    return 'PerIntervalCounter';
  } else if (COUNT_RX.test(name)) {
    return 'IntCounter';
  } else if (AVG_RX.test(name)) {
    return 'IntAverage';
  } else if (TIERS_RX.test(name)) {
    return 'IntAverage';
  } else {
    return 'IntCounter';
  }
}
