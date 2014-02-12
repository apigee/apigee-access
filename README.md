# apigee-node-extensions

This module allows Node.js applications running on the Apigee Edge platform
a way to access variables set within Apigee's message context. It is intended
to be used when deploying a Node.js program to the Apigee Edge product
and access to other Apigee functionality is needed.

When creating an API proxy in Apigee, it is common to set
variables that can be used to pass information from one policy to the next.

## Example

Imagine that an Edge policy running on the request path has set a variable
called "AuthenticatedUserId". Using this module, you may access that
variable as follows:

    var http = require('http');
    var apigee = require('apigee-extensions');

    http.createServer(function (request, response) {
      var context = apigee.getContext(request);
      var userId = context.variables.AuthenticatedUserId;
      console.log('Authenticated Apigee User ID is %s', userid);
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('Hello World\n');
    }).listen(8124);

    console.log('Server running at http://127.0.0.1:8124/');

### When Should I Use This?

When you are an Apigee Edge user who is combining the traditional policy-based
configuration of an API proxy with Node.js code.

### When Should I Not Use This?

If you are not deploying to Apigee Edge and not using the existing policy
framework, then this module makes no sense.

If you don't know what we're talking about so far, then you don't need
this module.

## Detailed Documentation

The module contains the function:

    apigee.getContext(request);
    
It takes one parameter, which is the HTTP request object.

The resulting object contains a single object called "variables." This is
a JavaScript object that contains a property for each variable in the Apigee
message context.

### Getting a variable

Since "variables" is a standard object, you may access its properties directly
or using an array, like any JavaScript object.

Note that many Apigee variables have dots in their names -- these are
*not* represented as sub-objects in JavaScript. So, it is necessary to use
the array accessor to get to them.

    var apigee = require('apigee-extensions');
    // "httpRequest" must be a request object that came from the http module
    var ctx = apigee.getContext(httpRequest);
    
    var val1 = ctx.variables.TestVariable;
    var val2 = ctx.variables['request.client.ip'];

### Setting a variable

Set a variable as you would with any JavaScript object.

Some variables are read-only -- an exception will be thrown if you try
to set one of them.

    var apigee = require('apigee-extensions');
    // "httpRequest" must be a request object that came from the http module
    var ctx = apigee.getContext(httpRequest);
    
    ctx.variables.TestVariable = 'foo';
    ctx.variables['TestVariable2'] = 'bar';
    // This will throw an exception
    ctx.variables['client.ip'] = 'Invalid';

### Deleting a variable

Delete a variable using "delete" as in regular JavaScript. Again, it is 
an error to delete a read-only variable.

    var apigee = require('apigee-extensions');
    // "httpRequest" must be a request object that came from the http module
    var ctx = apigee.getContext(httpRequest);
    
    delete ctx.variables.TestVariable;
    delete ctx.variables['request.with.dots'];
    // Throws an exception
    delete ctx.variables['client.ip'];
    
## Pre-Defined Variables Within Apigee Edge

You can find the link of supported variables at the following
page. These are the variables that are available when you
deploy a Node.js application to Apigee Edge.

Note that variables with a "." are not represented as sub-objects,
so you must use array notation to accesss them. In other words:

    // This variable reference is invalid
    var ip = ctx.variables.client.ip;
    // This refernce is valid
    var ip = ctx.variables['client.ip'];

You may of course add your own variables with your own names.

[http://apigee.com/docs/api-services/api/variables-reference]

## Convenience methods

In addition, the following convenience methods:

    apigee.setVariable(request, name, value);
    // Equivalent to "getContext(request).variables[name] = value;"
    
    apigee.getVariable(request, name);
    // Equivalent to "getContext(request).variables[name];"
    
    apigee.deleteVariable(request, name);
    // Equivalent to "delete getContext(request).variables[name];"

## Running Outside Apigee

This module also works outside Apigee Edge, but not all the pre-defined
variables are supported. This table shows which ones are available.
These variables are supported here in order to support local development
and testing of Node.js applications for Apigee Edge.

Again, inside Apigee Edge, a much larger set of pre-defined variables is 
supported -- please see the doc link above.

<table>
<tr><td><b>Variable</b></td><td><b>Read-Only</b></td><td><b>Type</b></td><td><b>Notes</b></td></tr>
<tr><td>client.received.start.time</td><td>Yes</td><td>String</td><td>Time at which the request was received</td></tr>
<tr><td>client.received.end.time</td><td>Yes</td><td>String</td><td>Time at which the request was received</td></tr>
<tr><td>client.received.start.timestamp</td><td>Yes</td><td>Integer</td><td>Time at which the request was received</td></tr>
<tr><td>client.received.end.timestamp</td><td>Yes</td><td>Integer</td><td>Time at which the request was received</td></tr>
</table>

This module works outside Apigee mainly for testing purposes. Missing a variable 
that you need for a test? It should be easy to add to this project.

