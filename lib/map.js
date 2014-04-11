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

var cache = require('./cache');
 
function createMap(name, mode, config) {
  return new Map(name, mode, config);
}

module.exports.createMap = createMap;

function Map(name, mode, config) {
  this.name = name;
  // Use the same naming convention that we use inside Apigee to
  // make the key-value-map cache different from a generic cache.
  this.cache = cache.createCache(name + "__kvmap", mode, config);
  
  if (mode === 'apigee') {
    var apigeeMap = require('apigee-internal-map');   
    var realConfig = (config ? config : {});
    
    // Apply defaults
    realConfig.name = name;
    if (!realConfig.scope) {
      realConfig.scope = 'exclusive';
    }
    
    this.impl = apigeeMap.createMap(process.env._APIGEE_APP_ID, realConfig);
    
  } else {
    this.objects = {};
  }
}

function handleCacheGet(self, key, err, item, cb) {
  if (!err && item) {
    // Cache hit -- return right away
    cb(err, item);
    
  } else {
    // Read the "real" KVM
    if (self.impl) {
      self.impl.get(key, function(err, item) {
          cb(err, item);
      });
      
    } else {
      var item = self.objects[key];
      cb(undefined, item);
    }
  }
}

Map.prototype.get = function(key, cb) {
  if (!(typeof key === 'string')) {
    throw new Error('key must be a string');
  }
  if (!cb) {
    throw new Error('callback must be specified');
  }
  
  var self = this;
  self.cache.get(key, function(err, item) {
      handleCacheGet(self, key, err, item, cb);
  });
};

Map.prototype.put = function(key, data, cb) {
  if (typeof key !== 'string') {
    throw new Error('key must be a string');
  }
  if (typeof data !== 'string') {
    throw new Error('data must be a string');
  }
  
  if (this.impl) {
    var self = this;
    self.impl.put(key, data, function(err) {
        // Put into the cache after inserting to the actual map with no wait
        self.cache.put(key, data);
        if (cb) {
          cb(err);
        }
    });
    
  } else {
    this.objects[key] = data;
    this.cache.put(key, data, function() { });
    if (cb) {
      cb();
    }
  }
};

Map.prototype.remove = function(key, cb) {
  // Remove from the cache but don't wait
  this.cache.remove(key);
  
  if (this.impl) {
    this.impl.remove(key, function(err) {
        if (cb) {
          cb(err);
        }
    });
    
  } else {
    delete this.objects[key];
    if (cb) {
      cb();
    }
  }
};


