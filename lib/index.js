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
 
function getContext(request) {
  return new Context(request);
}
module.exports.getContext = getContext;

function getVariable(request, v) {
  return getContext(request).variables[v];
}
module.exports.getVariable = getVariable;

function setVariable(request, v, value) {
  getContext(request).variables[v] = value;
}
module.exports.setVariable = setVariable;

function deleteVariable(request, v) {
  delete getContext(request).variables[v];
}
module.exports.deleteVariable = deleteVariable;
 
function Context(request) {
  this.variables = request._apigeeAttachment;
  if (!this.variables) { 
    request._apigeeAttachment = {};
    this.variables = request._apigeeAttachment;
    setPreDefinedVariables(this.variables);
  }
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

// That's it! "Variables" is an object with properties.

