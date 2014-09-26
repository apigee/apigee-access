/*
 * Copyright 2014 Apigee Corporation.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
 /* jshint node: true */

'use strict';

var util = require('util');

var access = require('./index');
if (access.getMode() !== access.APIGEE_MODE) {
  throw new Error('SpikeArrest is only supported when deployed to Apigee Edge');
}

var apigeeSpikeArrest;
try {
  apigeeSpikeArrest = require('apigee-internal-spikearrest');
} catch (e) {
  throw new Error('SpikeArrest is not supported in this version of Apigee Edge');
}

var DEFAULT_WEIGHT = 1;

function SpikeArrest(opts) {
  this.spikeArrest =
    apigeeSpikeArrest.createSpikeArrest(process.env._APIGEE_APP_ID);
}

module.exports.createSpikeArrest = function(opts) {
  return new SpikeArrest(opts);
};

function defaultOpts(o) {
  var opts = o ? o : {};

  return opts;
}

SpikeArrest.prototype.apply = function(o, cb) {
  if (!cb) {
    throw new Error('Callback must be supplied');
  }
  if (typeof cb !== 'function') {
    throw new Error('Callback must be a function');
  }

  var opts = defaultOpts(o);

  if (!opts.allow) {
    throw new Error('Allowed value must be supplied');
  }
  opts.allow = Number(opts.allow);
  opts.weight = (opts.weight ? Number(opts.weight) : DEFAULT_WEIGHT);

  this.spikeArrest.apply(opts, function(err, result) {
    if (err) {
      cb(err);
    } else {
      cb(undefined, result);
    }
  });
};
