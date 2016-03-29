# What yo' mama ain't told ya' about Promises - or - native browser Promises in JavaScript

*Tomasz Maćkowiak, kurazu@kurazu.net, for 2nd STX Next Summit 2016*

Promises are a fairly new API for dealing with deferred execution in JavaScript.
Handling complex cases of asynchrous tasks that depend on each other can be very tricky and strainous using (possibly nested) callbacks.
Promises deliver a new, minimalistic API that shifts the balance of responsibilites when dealing with results of deferred events.
The concept is beautifully simple and elegant.

## The problem

Consider this classic way of making an *AJAX* request using *jQuery*:

```
$.ajax({
    url: '/endpoint',
    method: 'POST',
    data: 'SOME DATA',
    success: function(data, textStatus, jqXHR) {
        console.log('Data fetched', data.result.value);
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.error('Fetch failed', errorThrown);
    }
});
```

We ask for some data from the server, when we get it, we retrieve something from the response and use it. Otherwise we log an error.

Seems straight-forward enough. You've probably seen this pattern hundreds of times. It works.

But...

What happens when the success handler throws an error? For example, when the `data` is missing the `result`. jQuery would need to handle the error.

And why does *jQuery* need to know how I want to handle the result? It's none of *jQuery*'s business.

What if I would want to call few callbacks when *AJAX* request finishes? Or if I would need to start another *AJAX* request with data taken from the first one? What if I need to make 3 *AJAX* requests and wait for all of them to finish? Does this approach scale?

## The solution

Wouldn't it be nicer if we could write our code like this:

```
var promise;

promise = fetchDataFromBackend({
    url: '/endpoint',
    data: 'SOME DATA',
    method: 'POST'
});
promise.then(function(data) {
    console.log('Data fetched', data.result.value);
});
promise.catch(function(error) {
    console.error('Fetch failed', error);
});
```

Here our `fetchDataFromBackend` function gets only the parameters needed to make an *AJAX* request. The handlers for both success and failure are attached outside the function itself - so the `fetchDataFromBackend` function does not need to concern itself with calling handlers and handling errors in them.

## The implementation

How can we implement such function?

```
function fetchDataFromBackend(options) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: options.url,
            method: options.method,
            data: options.data,
            success: function(data, textStatus, jqXHR) {
                resolve(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            }
        });
    });
}
```

In the code above we are adding a native `Promise` wrapper around *jQuery* *AJAX* call. In the success handler we are **resolving** our `Promise` and in the error handler we are **rejecting** it. The function itself doesn't need to know anything about handlers that will be attached.

## Promise API

As we have seen in the example above the `Promise` API seems rather simple. There is the constructor and there are functions for connecting handlers.

That is all the API you need to know to start using `Promise`s.

### Constructor and executor

The `Promise` constructor always receives one argument: a function called the *executor*. This *executor* is called **synchronously** from within the `Promise` constructor and the API exposes to it two callback functions: one for resolving the `Promise` (success callback, usually named `resolve`) and one for rejecting it (error callback, usually named `reject`). The *executor* usuall starts an asynchronous operation and then it uses the two callbacks to signal to the `Promise` that the operation either succeeded or failed.

Both callbacks only accept one parameter. This single parameter will be the one that handlers attached to the `Promise` will later receive as the single argument. There is no use in passing multiple parameters. If you need to pass more than one value, resolve your promise with an `Array` of values and parse the `Array` back in your handler.

The argument to either `resolve` or `reject` callback can be any value. It can be a `Number`, `String`, `Object`, `null`, `undefined` or an `Error` instance. `Promise`s don't care. You can `reject` the `Promise` with something that is not an `Error` instance. 

### States

Promises can be in 3 states only:



### Handlers

### Utils

### Combining

### Chaining

### Nesting

## The asynchronous riddle

### Microtasks

### The event loop

## Alternatives

## Summary

