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
 
// Mode support -- determine whether we are running native to Apigee

var APIGEE_MODE = 'apigee';
var STANDALONE_MODE = 'standalone';

module.exports.APIGEE_MODE = APIGEE_MODE;
module.exports.STANDALONE_MODE = STANDALONE_MODE;

function getMode() {
  return STANDALONE_MODE;
}
module.exports.getMode = getMode;

// Variable support -- get and set flow variables

function getVariable(request, v) {
  return getContext(request).variables[v];
}
module.exports.getVariable = getVariable;

function setVariable(request, v, value) {
  var vars = getContext(request).variables;
  var desc = Object.getOwnPropertyDescriptor(vars, v);
  if (desc && !desc.writable) {
    throw new Error('Read only variable');
  }
  vars[v] = value;
}
module.exports.setVariable = setVariable;

function deleteVariable(request, v) {
  var vars = getContext(request).variables;
  var desc = Object.getOwnPropertyDescriptor(vars, v);
  if (desc && !desc.writable) {
    throw new Error('Read only variable');
  }
  delete vars[v];
}
module.exports.deleteVariable = deleteVariable;
 
function getContext(request) {
  var att = request._apigeeAttachment;
  if (!att) { 
    att = { variables: {} };
    request._apigeeAttachment = att;
    setPreDefinedVariables(att.variables);
  }
  return att;
}

function setPreDefinedVariables(v) {
  var now = new Date();
  
  Object.defineProperty(v, 'client.received.start.timestamp',
    { value: now.getTime(), writable: false });
  Object.defineProperty(v, 'client.received.end.timestamp',
    { value: now.getTime(), writable: false });
  Object.defineProperty(v, 'client.received.start.time',
    { value: now.toString(), writable: false });
  Object.defineProperty(v, 'client.received.end.time',
    { value: now.toString(), writable: false });
}

// Cache support

var caches = {};
var defaultCache = null;

function getCache(name) {
  if (name) {
    if (caches[name]) {
      return caches[name];
    }
    caches[name] = require('./cache').createCache(name);
    return caches[name];
    
  } else {
    if (defaultCache) {
      return defaultCache;
    }
    defaultCache = require('./cache').createCache();
    return defaultCache;
  }
}
module.exports.getCache = getCache;

// KVM support

var maps = {};

function getMap(name) {
  if (maps[name]) {
    return maps[name];
  }
  maps[name] = require('./map').createMap(name);
  return maps[name];
}
module.exports.getMap = getMap;


