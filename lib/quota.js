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

var access = require('./index');
if (access.getMode() !== access.APIGEE_MODE) {
  throw new Error('Quota is only supported when deployed to Apigee Edge');
}

var apigeeQuota;
try {
  apigeeQuota = require('apigee-internal-quota');
} catch (e) {
  throw new Error('Quota is not supported in this version of Apigee Edge');
}

var DEFAULT_INTERVAL = 1;
var DEFAULT_WEIGHT = 1;
var DEFAULT_SYNC_INTERVAL = 10;

function Quota(opts) {
  this.syncInterval =
    opts.syncInterval ? opts.syncInterval : DEFAULT_SYNC_INTERVAL;
  this.quota =
    apigeeQuota.createQuota(process.env._APIGEE_APP_ID);
}

module.exports.createQuota = function(opts) {
  return new Quota(opts);
};

Quota.prototype.apply = function(o, cb) {
  var opts = o ? o : {};

  if (!cb) {
    throw new Error('Callback must be supplied');
  }
  if (typeof cb !== 'function') {
    throw new Error('Callback must be a function');
  }

  if (!opts.identifier) {
    throw new Error('Quota identifier must be supplied');
  }
  if (typeof opts.identifier !== 'string') {
    throw new Error('Quota identifier must be a string');
  }

  if (!opts.timeUnit) {
    throw new Error('Quota time unit must be supplied');
  }
  if (typeof opts.timeUnit !== 'string') {
    throw new Error('Quota time unit must be a string');
  }

  if (!opts.allow) {
    throw new Error('Allowed value must be supplied');
  }
  opts.allow = Number(opts.allow);

  opts.interval = (opts.interval ? Number(opts.interval) : DEFAULT_INTERVAL);
  opts.weight = (opts.weight ? Number(opts.weight) : DEFAULT_WEIGHT);

  if (!opts.syncInterval) {
    opts.syncInterval = this.syncInterval;
  }

  this.quota.apply(opts, function(err, result) {
    if (err) {
      cb(err);
    } else {
      cb(undefined, result);
    }
  });
};

Quota.prototype.reset = function(opts, cb) {
  if (!cb) {
    throw new Error('Callback must be supplied');
  }
  if (typeof cb !== 'function') {
    throw new Error('Callback must be a function');
  }

  if (!opts.identifier) {
    throw new Error('Quota identifier must be supplied');
  }
  if (typeof opts.identifier !== 'string') {
    throw new Error('Quota identifier must be a string');
  }

  if (!opts.timeUnit) {
    throw new Error('Quota time unit must be supplied');
  }
  if (typeof opts.timeUnit !== 'string') {
    throw new Error('Quota time unit must be a string');
  }

  opts.interval = (opts.interval ? Number(opts.interval) : DEFAULT_INTERVAL);

  if (!opts.syncInterval) {
    opts.syncInterval = this.syncInterval;
  }

  this.quota.reset(opts, function(err) {
    cb(err);
  });
};
