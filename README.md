# apigee-access

The apigee-access module allows Node.js applications running on the Apigee Edge platform
a way to access Apigee-specific functionality. You can use this module to:

* Access and modify "flow variables" within the Apigee message context.
* Use the built-in distributed cache.

Use this module when you deploy a Node.js program to Apigee Edge to access Apigee-specific functionality. You can use it to 
build an application that is optimized for Apigee Edge, or it may be used
to build higher-level functionality.

To support local development and testing, this module works in a 
local mode with no dependencies on Apigee functionality. When deployed to
Apigee Edge, this functionality is replaced with native Apigee functionality.

This module is intended for use by developers who intend to primarily deploy
to Apigee. For a more comprehensive set of tools that may be used in a 
variety of environments both inside and outside Apigee, please see our suite
of "Volos" modules:

[https://www.npmjs.org/search?q=volos](https://www.npmjs.org/search?q=volos)

### When Should I Use This?

Use this module:

* When you are an Apigee Edge user who is combining the traditional policy-based
configuration of an API proxy with Node.js code.

* When you are an Apigee Edge user who wants to take advantage of the built-in
distributed cache available on the platform.

### When Should I Not Use This?

Do not use this module:

* If you are not deploying to Apigee Edge and not using the existing policy
framework, then this module makes no sense.

* If you don't know what we're talking about so far, then you don't need
this module.

## Behavior when Deployed to Apigee Edge

* *Variable Access*: Variables set by other Apigee Edge policies are visible
to this module, and variables added or modified by this module are visible
to subsequent policies.

* *Cache*: Items placed in the cache are visible to all instances of the
application deployed to Apigee Edge.

## Behavior when Running Outside Apigee

* *Variable Access*: Variables are only visible to the current Node.js
application. A (small) set of pre-defined variables is also populated for
testing.

* *Cache*: Items in the cache are only visible to the current Node.js 
application.

When creating an API proxy in Apigee, it is common to set
variables that can be used to pass information from one policy to the next.

## Example

Imagine that an Edge policy running on the request path has set a variable
called "AuthenticatedUserId". Using this module, you may access that
variable as follows:

    var http = require('http');
    var apigee = require('apigee-access');

    http.createServer(function (request, response) {
      var userId = apigee.getVariable(request, 'AuthenticatedUserId');
      console.log('Authenticated Apigee User ID is %s', userid);
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('Hello World\n');
    }).listen(8124);

    console.log('Server running at http://127.0.0.1:8124/');

# Detailed Documentation

## Methods

The module supports the following methods. Note that some methods require a request object that came from the http module.
The methods are described in more detail in the following sections.

    getVariable(request, name);
    setVariable(request, name, value);
    setIntVariable(request, name, value);
    deleteVariable(request, name);
    getCache(name);
    getMode();
   
And the following constant properties:

    APIGEE_MODE = 'apigee';
    STANDALONE_MODE = 'standalone';

## Accessing Variables

Variables are part of the flow of each message through the Apigee Edge product.
Among other things, they represent the context between the different policies
that may affect the message as it flows through Apigee. There are a few
reasons to access this data from Node.js:

* To gain access to variables that may have been set by Apigee policies that
ran before the Node.js code was invoked.

* To set variables from Node.js that might be used by other Apigee policies
that run after the Node.js code.

* To access predefined variables in Apigee Edge that are not available using
standard Node.js HTTP request objects, such as timestamps on the message.

For a complete list of predefined flow variables refer to the Apigee Edge [Variables reference](http://apigee.com/docs/api-services/api/variables-reference). Policy variables are described in the Apigee Edge [Policy Reference](http://apigee.com/docs/content/policy-reference-overview)

### Getting a variable

    var apigee = require('apigee-access');
    // "httpRequest" must be a request object that came from the http module
    var val1 = apigee.getVariable(request, 'TestVariable');
    var val2 = apigee.getVariable(request, 'request.client.ip');
    
The value may be a string or a number, depending on the type that was
set using "setVariable," or if the variable is built in to Apigee, depending
on the type of the built-in variable.

### Setting a variable

Some variables are read-only -- an exception will be thrown if you try
to set one of them.  

    var apigee = require('apigee-access');
    // "httpRequest" must be a request object that came from the http module
    apigee.setVariable(request, 'TestVariable', 'bar');
    // This will throw an exception
    apigee.setVariable(request, 'client.ip', 'Invalid');
   
For each variable, the key must be a string. The value may be a number, String,
boolean, null, or undefined.

### Setting an integer variable

    var apigee = require('apigee-access');
    // Convert "123" to an integer and set it
    apigee.setIntVariable(request, 'TestVariable', '123');
    // Use something that's already a number
    apigee.setIntVariable(request, 'TestVariable2', 42);
    
"setIntVariable" is a convenience method that first coerces "value" to an 
integer, and then sets it. "value" must be a string or number.

### Deleting a variable

It is an error to delete a read-only variable. For a complete list of read-only variables, see the Apigee Edge [Variables Reference](http://apigee.com/docs/api-services/api/variables-reference).

    apigee.deleteVariable(request, 'TestVariable');
    // This will throw an exception
    apigee.deleteVariable(request, 'client.ip', 'Invalid');
    
## Pre-Defined Variables Within Apigee Edge

You can find the link of supported variables at the following
page. These are the variables that are available when you
deploy a Node.js application to Apigee Edge.

You may of course add your own variables with your own names.

You can find the complete list of pre-defined variables in the [Variables Reference](http://apigee.com/docs/api-services/api/variables-reference).

## Running Outside Apigee Edge

This module also works outside of Apigee Edge, but not all the pre-defined
variables are supported. This table shows which ones are available.
These variables are supported here in order to support local development
and testing of Node.js applications for Apigee Edge.


<table>
<tr><td><b>Variable</b></td><td><b>Read-Only</b></td><td><b>Type</b></td><td><b>Notes</b></td></tr>
<tr><td>client.received.start.time</td><td>Yes</td><td>String</td><td>Time at which the request was received</td></tr>
<tr><td>client.received.end.time</td><td>Yes</td><td>String</td><td>Time at which the request was received</td></tr>
<tr><td>client.received.start.timestamp</td><td>Yes</td><td>Integer</td><td>Time at which the request was received</td></tr>
<tr><td>client.received.end.timestamp</td><td>Yes</td><td>Integer</td><td>Time at which the request was received</td></tr>
</table>

Again, on the Apigee Edge platform, a much larger set of pre-defined variables is 
supported -- please refer to the Apigee Edge [Variables Reference](http://apigee.com/docs/api-services/api/variables-reference).

This module works outside Apigee mainly for testing purposes. Missing a variable 
that you need for a test? Open a GitHub issue and we can add it, or send a 
pull request.

## Working with the Cache

The cache may be used to store strings or data. Like most caches, it is a
least-recently-used cache with a maximum size.

Inside Apigee Edge, the cache is distributed between all nodes where the Node.js
application executes.

Configuration of the cache is managed via a "cache resource." You can use the
Apigee Edge API to manually create cache resources, or you can use the
default resource. 

For an introduction to caching on Apigee Edge, refer to the  [Persistence](http://apigee.com/docs/gateway-services/content/persistence) documentation topic on the Apigee Edge website.

When this module is used outside of Apigee Edge, the cache is stored in memory
inside Node.js. This support is provided primarily for testing purposes.

### Accessing a cache

    var apigee = require('apigee-access');
    // Look up the cache named "cache" and create it if necessary. The
    // resulting cache uses a pre-defined set of configuration parameters
    // that should be workable for most situations.
    var cache = apigee.getCache('cache');
    // Get access to a custom cache resource
    var customCache = apigee.getCache('MyCustomCache',
      { resource: 'MyCustomrResource'} ); 
    
To use a cache, call "getCache". This takes a name, and an optional
configuration object.

The configuration object may be empty, or it may contain the following
optional parameters:

* **resource**: The name of an Apigee "cache resource" where the data should
be stored. Cache resources are used to fine-tune memory allocation and
other cache parameters. If not
specified, a default resource will be used. If the cache resource
does not exist, then an error will be thrown. See below for more documentation
in this feature.

* **scope**: Specifies whether cache entries are prefixed to prevent collisions.
Valid values are "global", "application," and "exclusive". These are
defined below. The default scope is "exclusive."

* **defaultTtl**: Specifies the default time to live for a cache entry, in
seconds. If not specified then the default TTL in the cache resource
will be used.

* **timeout**: How long to wait to fetch a result from the distributed cache,
in seconds. The default 30 seconds. Latency-sensitive applications may
wish to reduce this in order to prevent slow response times if the
cache infrastructure is overloaded.

For information about how to create a cache resource, see the Apigee Edge doc topic [Manage Caches for an Environment](http://apigee.com/docs/gateway-services/content/manage-caches-environment).

The following values are valid for the "scope" field:

* **global**: All cache entries may be seen by all Node.js applications in the same
Apigee "environment."

* **application**: All cache entries may be seen by all Node.js caches that
are part of the same Apigee Edge application.

* **exclusive**: Cache entries are only seen by Node.js caches in the same
application that have the same name. This is the default.
    
### Inserting or Replacing an item

    var apigee = require('apigee-access');
    var cache = apigee.getCache();
    // Insert a string with a timeout of 120 seconds
    cache.put('key2', 'Hello, World!', 120);
    // Insert a string and get notified when insert is complete
    cache.put('key4', 'Hello, World!', function(err) {
      // "err" will be undefined unless there was an error on insert
    });
    
"put" takes four parameters:

* **key** (required): A string that uniquely identifies the item in the cache.

* **data** (required): A string, Buffer, or object that represents the data to cache.
Any other data type will result in an error. For convenience, objects will
be converted into a string using "JSON.stringify".

* **ttl** (optional): The maximum time to persist the data in the cache, in
seconds. If not specified then a default TTL will be used.

* **callback** (optional): If specified, a function that will be called once the
data is safely in the cache. It will be called with an Error object as the
first parameter if there is an insertion error, and otherwise it will be
called with no parameters.

### Retrieving an item 

    var apigee = require('apigee-access');
    var cache = apigee.getCache();
    cache.get('key', function(err, data) {
      // If there was an error, then "err" will be set
      // "data" is the item that was retrieved
      // It will be a Buffer or a String depending on what was inserted..
    });
    
"get" takes two parameters:

* **key** (required): A string that uniquely identifies the item in the cache.

* **callback** (required): A function that will be called when the data
is available. 

The callback must be a function that takes two parameters:

The first is an error -- if there is an error while retrieving from the 
cache, then an Error object will be set here. Otherwise this parameter
will be set to "undefined".

The second is the data retrieved, if any. It will be one of four values:

* If a string was inserted, it will be a string.
* If a Buffer was inserted, it will be a Buffer.
* If an object was inserted, it will be a string containing the JSON
version of the object as produced by "JSON.stringify".
* If nothing was found, then it will be "undefined".

### Invalidating an Item

    var apigee = require('apigee-access');
    var cache = apigee.getCache();
    cache.remove('key');

This method invalidates the key. Like "put," it optionally takes a function
as the second parameter, which will be called with an Error object
as the first parameter if there is an error.

Once a key is invalidated, subsequent "get" requests will return 
"undefined" unless another value is inserted.

## Determining the Deployment Mode

As mentioned previously, you can use this module in an application that is deployed to Apigee Edge or in standalone mode on your local machine. To determine which mode you are running in:

    var apigee = require('apigee-access')
    console.log('The deployment mode is ' + apigee.getMode());
    
The getMode() method returns a string that determines where the module has been
deployed.

If it returns the string "apigee," then the application is running on Apigee
Edge and all functionality is supported.

If it returns the string "standalone," then the application is running outside
the Apigee Edge environment, and the default functionality described
at the top of the document takes effect.