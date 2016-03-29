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

## Promise API

### Constructor and executor

### States

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

