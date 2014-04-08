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
 
function createMap(name) {
  return new Map(name);
}

module.exports.createMap = createMap;

function Map(name) {
  this.name = name;
  this.objects = {};
}

Map.prototype.get = function(key, cb) {
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
  cb(undefined, item);
};

Map.prototype.put = function(key, data, cb) {
  if (!key) {
    throw new Error('key must be specified');
  }
  if (!(typeof key === 'string')) {
    throw new Error('key must be a string');
  }
  
  this.objects[key] = data;
  if (cb) {
    cb();
  }
};

Map.prototype.remove = function(key, cb) {
  delete this.objects[key];
  if (cb) {
    cb();
  }
};


