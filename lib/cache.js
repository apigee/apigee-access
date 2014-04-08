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
 
'use strict';
 
function createCache(name) {
  return new Cache(name);
}

module.exports.createCache = createCache;

function Cache(name) {
  this.name = name;
  this.objects = {};
}

Cache.prototype.setEncoding = function(encoding) {
  this.encoding = encoding;
};

Cache.prototype.get = function(key, cb) {
  if (!key) {
    throw new Error('key must be specified');
  }
  if (!(typeof key === 'string')) {
    throw new Error('key must be a string');
  }
  if (!cb) {
    throw new Error('callback must be specified');
  }
  
  var item = this.objects[key];
  if (item && this.encoding) {
    cb(undefined, item.toString(this.encoding));
  } else {
    cb(undefined, item);
  }
};

Cache.prototype.put = function(key, data, encoding, ttl, cb) {
  if (!key) {
    throw new Error('key must be specified');
  }
  if (!(typeof key === 'string')) {
    throw new Error('key must be a string');
  }
  
  if (typeof encoding === 'function') {
    // key, data, cb
    cb = encoding;
    encoding = undefined;
  } else if (typeof encoding === 'number') {
    // key, data, ttl, (cb)
    cb = ttl;
    ttl = encoding;
    encoding = undefined;
  } else if (typeof ttl === 'function') {
    // key, data, encoding, cb)
    cb = ttl;
    ttl = undefined;
  }
  
  var buf;
  if (data instanceof Buffer) {
    buf = data;
  } else if (typeof data === 'string') {
    if (encoding) {
      buf = new Buffer(data, encoding);
    } else {
      buf = new Buffer(data);
    }
  } else if (typeof data === 'object') {
    buf = JSON.stringify(data);
  } else {
    throw new Error('data must be a string, Buffer, or object');
  }
  
  this.objects[key] = buf;
  if (cb) {
    cb();
  }
};

Cache.prototype.remove = function(key, cb) {
  delete this.objects[key];
  if (cb) {
    cb();
  }
};


