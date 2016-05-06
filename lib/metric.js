// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: strong-agent-ca
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

var lodash = require('lodash');
var nameOf = lodash.memoize(translateName);
var typeOf = lodash.memoize(translateType);
var valueMakerFor = lodash.memoize(valueTranslator);
var reducerOf = lodash.memoize(valueReducer);
var resetterOf = lodash.memoize(valueResetter);

module.exports = exports = makeCaMetrics;
exports.valueMakerFor = valueMakerFor;
exports.nameOf = nameOf;
exports.reducerOf = reducerOf;
exports.resetterOf = resetterOf;
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
  return Math.round;
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

function valueResetter(name) {
  if (name === 'http.connection.count') {
    return sum;
  } else {
    return empty;
  }

  function sum(values) {
    var total = values.reduce(function(acc, v) {
      return acc + v;
    }, 0);
    return [total];
  }
  function empty(values) {
    return [];
  }
}

// Names: | separated path with : separator before value name
var TIERS_RX = /^tiers\.(.+)_(in|out)?\.(minimum|average|maximum)$/;
var NEW_TIERS_RX = /^(?:tiers\.)?(\d+\.\d+\.\d+\.\d+(?::\d+)?)_?(in|out)?\.(minimum|average|maximum)$/; // jshint ignore:line

function translateName(name, prefix) {
  if (TIERS_RX.test(name)) {
    name = tiersName(TIERS_RX, name);
  } else if (NEW_TIERS_RX.test(name)) {
    name = tiersName(NEW_TIERS_RX, name);
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
    units = ' (ms)';
  }
  return name.replace('.', ':') + units;
}

// given a pattern that captures groups and matches against name:
// return a string that joins those groups with | for all but the last,
// which uses : as the separator.
function tiersName(pattern, name) {
  var parts = pattern.exec(name).map(sanitizePart);
  var head = lodash.compact(parts.slice(1, -1)).join('|');
  var tail = lodash.last(parts);
  return 'backends|' + head + ':' + tail;
}

function sanitizePart(str) {
  return str && str.replace(/[:|]/g, '-');
}


// Types: IntCounter, IntAverage, ...

var COUNT_RX = /\.(maximum|minimum|count)$/;
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
