# apigee-access

This module allows Node.js applications running on the Apigee Edge platform
a way to access Apigee-specific functionality. The following features
may be accessed:

* Accessing and modifying "flow variables" within the Apigee message
context.
* Using the built-in distributed cache.
* Using the built-in key-value map.

This module is intended
to be used when deploying a Node.js program to the Apigee Edge product
and access to Apigee-specific functionality is needed. It may be used to
build an application that is optimized for Apigee Edge, or it may be used
to build higher-level functionality.

In order to support local development and testing, this module works in a 
local mode with no dependencies on Apigee functionality. When deployed to
Apigee Edge, this functionality is replaced with native Apigee functionality.

This module is intended for use by developers who intend to primarily deploy
to Apigee. For a more comprehensive set of tools that may be used in a 
variety of environments both inside and outside Apigee, please see our suite
of "Volos" modules:

(https://www.npmjs.org/search?q=volos)[https://www.npmjs.org/search?q=volos]

### When Should I Use This?

When you are an Apigee Edge user who is combining the traditional policy-based
configuration of an API proxy with Node.js code.

### When Should I Not Use This?

If you are not deploying to Apigee Edge and not using the existing policy
framework, then this module makes no sense.

If you don't know what we're talking about so far, then you don't need
this module.

## Behavior when Deployed to Apigee Edge

* *Variable Access*: Variables set by other Apigee Edge policies are visible
to this module, and variables added or modified by this module are visible
to subsequent policies.
* *Cache*: Items placed in the cache are visible to all instances of the
application deployed to Apigee Edge.
* *Key-Value Map*: Items placed in the key-value map are visible to all
instances of the application deployed to Apigee Edge.

## Behavior when Running Outside Apigee

* *Variable Access*: Variables are only visible to the current Node.js
application. A (small) set of pre-defined variables is also populated for
testing.
* *Cache*: Items in the cache are only visible to the current Node.js 
application.
* *Key-Value Map*: Items in the key-value map are only visible to the current
Node.js application, and they are not persisted to disk.

When creating an API proxy in Apigee, it is common to set
variables that can be used to pass information from one policy to the next.

## Example

Imagine that an Edge policy running on the request path has set a variable
called "AuthenticatedUserId". Using this module, you may access that
variable as follows:

    var http = require('http');
    var apigee = require('apigee-access');

    http.createServer(function (request, response) {
      var userId = apigee.getVariable('AuthenticatedUserId');
      console.log('Authenticated Apigee User ID is %s', userid);
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('Hello World\n');
    }).listen(8124);

    console.log('Server running at http://127.0.0.1:8124/');

# Detailed Documentation

The module supports the following functions:

    getVariable(request, name);
    setVariable(request, name, value);
    deleteVariable(request, name);
    getCache(name);
    getMap(name);
    getMode();
   
And the following constant properties:

    APIGEE_MODE = 'apigee';
    STANDALONE_MODE = 'standalone';

## Variables

Variables are part of the flow of each message through the Apigee Edge product.
Among other things, they represent the context between the different policies
that may affect the message as it flows through Apigee. There are a few
reasons to access this data from Node.js:

* To gain access to variables that may have been set by Apigee policies that
ran before the Node.js code was invoked.
* To set variables from Node.js that might be used by other Apigee policies
that run after the Node.js code.
* To access predefined variables in Apigee Edge that are not avaialable using
standard Node.js HTTP request objects, such as timestamps on the message.

### Getting a variable

    var apigee = require('apigee-extensions');
    // "httpRequest" must be a request object that came from the http module
    var val1 = apigee.getVariable(request, 'TestVariable');
    var val2 = apigee.getVariable(request, 'request.client.ip');

### Setting a variable

Some variables are read-only -- an exception will be thrown if you try
to set one of them.

    var apigee = require('apigee-extensions');
    // "httpRequest" must be a request object that came from the http module
    apigee.setVariable(request, 'TestVariable', 'bar');
    // This will throw an exception
    apigee.setVariable(request, 'client.ip', 'Invalid');

### Deleting a variable

It is an error to delete a read-only variable.

    apigee.deleteVariable(request, 'TestVariable');
    // This will throw an exception
    apigee.deleteVariable(request, 'client.ip', 'Invalid');
    
## Pre-Defined Variables Within Apigee Edge

You can find the link of supported variables at the following
page. These are the variables that are available when you
deploy a Node.js application to Apigee Edge.

You may of course add your own variables with your own names.

The list of variables may be found here:

[http://apigee.com/docs/api-services/api/variables-reference]

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

## Cache

The cache may be used to store strings or data. Like most caches, it is a
least-recently-used cache with a maximum size.

Inside Apigee Edge, the cache is distributed between all nodes where the Node.js
application executes.

Configuration of the cache is managed via a "cache resource." You can use the
Apigee Edge API to manually create cache resources, or you can use the
default resource.

When this module is used outside Apigee Edge, the cache is stored in memory
inside Node.js.

### Accessing a cache

    var apigee = require('apigee-access');
    // Get access to the default cache, which is best for most purposes
    var cache = apigee.getCache();
    // Get access to a custom cache resource
    var customCache = apigee.getCache('MyCustomCache');
    
To use a cache, call "getCache". This takes an optional argument -- if it
is called with no parameter, it returns a default cache. You can also
specify the name of a "cache resource," which is something that you can create
using the Apigee API.
    
### Retrieving an item as a Buffer

    var apigee = require('apigee-access');
    var cache = apigee.getCache();
    cache.get('key', function(data) {
      // "data" is the item that was retrieved
      // It will be a Buffer.
    });
    
To retrieve an item, call the "get" function. It takes one parameter, which
is a key. The key can be any string that you like.

Regardless of how an item was inserted, it is returned as a Buffer object
unless "setEncoding" was called, as shown below.

### Retrieving an item as a String

    var apigee = require('apigee-access');
    var cache = apigee.getCache();
    cache.setEncoding('utf8');
    cache.get('key', function(data) {
      // "data" is the item that was retrieved
      // It will be a String.
    });
    
When "setEncoding" is set on a cache, all items will be retrieved as
a String, interpreted using the specified encoding.
    
### Inserting or Replacing an item

    var apigee = require('apigee-access');
    var cache = apigee.getCache();
    // Insert a String with 'ascii' encoding and expiration
    cache.put('key', 'Hello, World!', 'ascii', 10000);
    // Insert a string with default (UTF8) encoding
    cache.put('key2', 'Hello, World!');
    // Insert an object
    cache.put('key3', { foo: 123, bar:456 });
    // Insert a string and get notified when insert is complete
    cache.put('key4', 'Hello, World!', function(err) {
      // "err" will be undefined unless there was an error on insert
    });
    
Each item in the cache consists of a key and some data. 

Data items may be Strings, Buffers, or objects. Items are handled
as follows:

* If the item is a String, then it is converted to a Buffer and stored
in the cache. If the third argument to "put" is a string, then it is treated 
as the string encoding to use for the conversion -- otherwise, UTF-8 is
used.
* If the item is a Buffer, then it is put directly in the cache.
* If the item is an Object, then it is serialized into a JSON string and
inserted in the cache using UTF-8 encoding.
* Otherwise, an Error is thrown.

To be notified when the insert completes, and whether it is successful, pass
a function as the last argument. If there is an error, then the first
parameter will be an Error object.

### Invalidating an Item

    var apigee = require('apigee-access');
    var cache = apigee.getCache();
    cache.remove('key');
    
## Key-Value Map

The key-value map is a persistent store of keys and values. 

Within Apigee Edge, a key-value map is a database that is available to all
instances of the application running inside Apigee. A key-value map is very
similar to a cache, but it has a few differences:

* Data never expires from a KVM, and it is never purged because the KVM
is full.
* Data is always persistent in the KVM, regardless of changes in the 
infrastructure or service failures.
* Changes to data in the KVM, and removals of data items, may propagate
more quickly.

Outside Apigee, the key-value map is simply kept in memory.

The key-value map in Apigee is a very simple thing. Unlike the cache, which
stores Buffer objects internally, the key-value map only stores Strings,
and maps of strings, represented as one-dimensional JSON objects.

### Accessing a KVM

    var apigee = require('apigee-access');
    // Get access to a specific KVM
    var kvm = apigee.getMap('name');

To access a KVM, call "getMap," and pass a name. If the specified map
does not exist, then it will be created.
    
### Retrieving an item

    var apigee = require('apigee-access');
    var kvm = apigee.getMap('name');
    kvm.get('key', function(data) {
      // "data" is the item that was retrieved
      // It will be a String.
    });
    
To retrieve an item, call the "get" function. It takes one parameter, which
is a key. The key can be any string that you like.
    
### Inserting or Replacing an item

    var apigee = require('apigee-access');
    var kvm = apigee.getMap('name');
    // Insert a String with 'ascii' encoding
    kvm.put('key', 'Hello, World!', 'ascii');
    // Insert a string with default (UTF8) encoding
    cache.put('key2', 'Hello, World!');
    
Each item in the cache consists of a key and some data. 

The data item must also be a String. If it is not a String, 
then an error will be thrown.

### Removing an Item

    var apigee = require('apigee-access');
    var cache = apigee.getCache();
    cache.delete('key');
    
## Determining the Deployment Mode

    var apigee = require('apigee-access')
    console.log('The deployment mode is ' + apigee.getMode());
    
"getMode()" returns a string that determines where the module has been
deployed.

If it returns the string "apigee," then the application is running on Apigee
Edge and all functionality is supported.

If it returns the string "standalone," then the application is running outside
the Apigee Edge environment.

    
