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
 var http = require('http');
 var util = require('util');
 
 var PORT = process.env.PORT || 33334;
 
 var svr;
 
 describe('Apigee Extensions', function() {
     before(function(done) {
         svr = http.createServer(handleRequest);
         svr.listen(PORT, function() {
             done();
         });
     });
     
     after(function() {
         svr.close();
     });
     
     it('Set Get', function(done) {
         sendRequest('/setget', function(resp) {
             assert.equal(resp.statusCode, 200);
             done();
         });
     });
     
     it('Set Get Two', function(done) {
         sendRequest('/setgetsetget', function(resp) {
             assert.equal(resp.statusCode, 200);
             done();
         });
     });
     
     it('Delete', function(done) {
         sendRequest('/delete', function(resp) {
             assert.equal(resp.statusCode, 200);
             done();
         });
     });
     
     it('Predefined', function(done) {
         sendRequest('/predefined', function(resp) {
             assert.equal(resp.statusCode, 200);
             done();
         });
     });
 });
 
 function handleRequest(req, resp) {
   var ctx = apigee.getContext(req);
   
   if (req.url === '/setget') {
     assert(!ctx.variables.testone);
     ctx.variables.testone = 'Foo';
     assert.equal(ctx.variables.testone, 'Foo');
     
     assert.equal(apigee.getVariable(req, 'testone'), 'Foo');
     
   } else if (req.url === '/setgetsetget') {
     assert(!ctx.variables['test2']);
     ctx.variables['test2'] = 'Foo';
     assert.equal(ctx.variables['test2'], 'Foo');
     
     var ctx2 = apigee.getContext(req);
     assert.equal(ctx2.variables['test2'], 'Foo');
     ctx2.variables['test2'] = 'Bar';
     assert.equal(ctx2.variables['test2'], 'Bar');
     assert.equal(ctx.variables['test2'], 'Bar');
     
     apigee.setVariable(req, 'test2', 'Baz');
     assert.equal(apigee.getVariable(req, 'test2'), 'Baz');
     
   } else if (req.url === '/delete') {
     assert(!ctx.variables.testhree);
     ctx.variables.testthree = 'Foo';
     assert.equal(ctx.variables.testthree, 'Foo');
     delete ctx.variables.testthree;
     assert(!ctx.variables.testhree);
     
     apigee.setVariable(ctx, 'test4', 'Bar');
     assert.equal(apigee.getVariable(ctx, 'test4'), 'Bar');
     apigee.deleteVariable(ctx, 'test4');
     assert(!apigee.getVariable(ctx, 'test4'));
     
   } else if (req.url === '/predefined') {
     assert(ctx.variables['client.received.start.timestamp']);
     assert.equal(typeof ctx.variables['client.received.start.timestamp'], 'number');
     assert(ctx.variables['client.received.end.timestamp']);
     assert.equal(typeof ctx.variables['client.received.end.timestamp'], 'number');
     assert(ctx.variables['client.received.start.time']);
     assert.equal(typeof ctx.variables['client.received.start.time'], 'string');
     assert(ctx.variables['client.received.end.time']);
     assert.equal(typeof ctx.variables['client.received.end.time'], 'string');
     
     assert.throws(function() {
         ctx.variables['client.received.end.time'] = 'Invalid';
     });
   
   } else {
     resp.writeHead(404);
     return;
   }
   
   resp.end();
 }
 
 function sendRequest(path, done) {
   http.get(util.format('http://localhost:%d%s', PORT, path), function(resp) {
       done(resp);
   });
 }
