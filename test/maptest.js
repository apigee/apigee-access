/*
 * Copyright 2013 Apigee Corporation.
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

var apigee = require('..');
var assert = require('assert');

var map;

before(function() {
    map = apigee.getMap('foo');
});

describe('Apigee Access Map', function() {
    it('Default Map', function(done) {
        var data1 = 'Hello, Key Value World!';
        map.put('key', data1, function(err) {
          assert(!err);
          map.get('key', function(err, val) {
            assert(!err);
            assert.equal(val, data1);
            done();
          });
        });  
    });
    it('Empty Map', function(done) {
        map.get('notFoundKey', function(err, val) {
            assert(!err);
            assert.equal(val, undefined);
            done();
        });
    });
    it('Remove', function(done) {
        var data2 = 'Goodbye, World!';
        map.put('key2', data2, function(err) {
          assert(!err);
          map.get('key2', function(err, val) {
            assert(!err);
            assert.equal(val, data2);
            map.remove('key2', function(err) {
                assert(!err);
                map.get('key2', function(err, data) {
                    assert(!err);
                    assert.equal(data, undefined);
                    done();
                });
            });
          });
        });
    });
    it('Invalid Data', function() {
        var badData = { one: 'Two', three: { four: 'four' }};
        assert.throws(function() {
            map.put('badData', badData);
        });
    });
    it('Invalid Key', function() {
        var d = { one: 1 };
        assert.throws(function() {
            map.put(123, d);
        });
    });
});

