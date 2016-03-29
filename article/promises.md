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

* **pending** - a `Promise` is in this state from the moment of creation until either it is resolved or rejected (either `resolve` or `reject` callback is called); `Promise` can never go back to this state once it leaves it.
* **fulfilled** - a `Promise` enters this state when it is resolved (operation ends successfully and  `resolve` is called); `Promise` can never leave this state (not even if you call `reject`).
* **rejected** - a `Promise` enters this state when it is rejected (operation ends with an error and  `reject` is called); `Promise` can never leave this state (not even if you call `resolve`).

The `resolve` and `reject` callbacks can be called only **once** for each `Promise`. Any subsequent calls to one or the other are ignored.

### Handlers

One can attach a handler that will be called when `Promise` is resolved successfully using `then` method. To attach a handler that will be called when `Promise` is rejected with an error one can use `catch` method. Both methods accept one parameter - a callback, that itself accepts one argument - the value that `Promise` was resolved or rejected with.

There is though a shortcut for attaching both success and error handler at the same time. Instead of writing:

```
promise.then(function(data) {
    console.log('Data fetched', data.result.value);
});
promise.catch(function(error) {
    console.error('Fetch failed', error);
});
```

one can write:

```
promise.then(function(data) {
    console.log('Data fetched', data.result.value);
}, function(error) {
    console.error('Fetch failed', error);
});
```

The API permits registering multiple handlers for each type of outcome:
```
promise.then(function(data) {
    console.log('Data fetched', data.result.value);
    throw new Error('BOOM');
});
promise.then(function(data) {
    alert('Promise resolved successfully');
});
promise.catch(function(error) {
    console.error('Fetch failed', error);
    throw new Error('BANG');
});
promise.catch(function(error) {
    console.error('Promise rejected with an error');
});
```
Depending on the `Promise` outcome, **each** callback for the appropriate event will be called, even if the previous one threw an error.

### Utils

The API exposes two utility functions for creating `Promise`s that are already *fulfilled* (`Promise.resolve`) or *rejected* (`Promise.reject`) with given value at creation time. Such `Promise`s can be used in the usual fashion - handlers can be attached to them.

```
Promise.resolve(17).then(function(n) {
    console.log('Seventeen', n);
});
Promise.reject(new Error('Bad luck!')).catch(function(err) {
    console.error('Error', err);
});
```

### Combining

### Chaining

### Nesting

## The asynchronous riddle

### Microtasks

### The event loop

## Alternatives

Native `Promises` should work across most modern browsers excluding Internet Explorer and some old Android browsers. It should work on recent Chrome, Firefox, Safari and Edge.

There are libraries that implement the `Promise` concept or even extend it, including:

* **jQuery** - has it's own implementation of deferreds and promises, with more methods.
* **AngularJS** -has it's own implementation of `Promises` (named `$q`)
* **Q**
* **RSVP.js**
* **when**

## Summary

