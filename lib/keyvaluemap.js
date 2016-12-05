/*
 * Copyright 2016 Apigee Corporation.
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

var apigeeKeyValueMap;

try {
    apigeeKeyValueMap = require('apigee-internal-keyvaluemap');
} catch (e) {
    // We will get here if not on Apigee or on an older version
    throw new Error('KeyValueMap is not available in this version' + e);
}

module.exports.getKeyValueMap = function(name, scope, api, revision) {
    return new KeyValueMap(name, scope, api, revision);
};


function KeyValueMap(name, scope, api, revision) {
    this.name = name;
    this.scope = scope;
    this.api = api;
    this.revision = revision;
}

KeyValueMap.prototype.getKeys = function(cb) {
    apigeeKeyValueMap.getKeys(process.env._APIGEE_APP_ID, this.name,
        this.scope, this.api, this.revision, function(err, keys) {
            cb(err, keys);
        });
};

KeyValueMap.prototype.get = function(key, cb) {
    apigeeKeyValueMap.getKey(process.env._APIGEE_APP_ID, key, this.name,
        this.scope, this.api, this.revision, function(err, value) {
            cb(err, value);
        });
};