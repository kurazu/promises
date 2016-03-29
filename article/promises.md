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

The callbacks are always executed **asynchronously**.

### Utils

The API provides two utility functions for creating `Promise`s that are already *fulfilled* (`Promise.resolve`) or *rejected* (`Promise.reject`) with given value at creation time. Such `Promise`s can be used in the usual fashion - handlers can be attached to them.

```
Promise.resolve(17).then(function(n) {
    console.log('Seventeen', n);
});
Promise.reject(new Error('Bad luck!')).catch(function(err) {
    console.error('Error', err);
});
```

### Combining

The API provides a very useful function that creates an output `Promise` that will only be *resolved* once **all** given input `Promise`s are resolved. The output `Promise` will be *rejected* if **any** of the input `Promise`s are rejected.

```
Promise.all([
    Promise.resolve(3),
    Promise.resolve(4)
]).then(function(args) {
    console.log('Three', args[0], 'Four', args[1]);
});
```

There is also a function that creates an output `Promise` that will assume the outcome of the one input `Promise` that resolves first (is either fullfilled successfully or rejected with an error).

```
function delayedPromise(delay, value) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(value);
            console.log(value, 'finished');
        }, delay);
    });
}

Promise.race([
    delayedPromise(735, 'Anna Kiełbasińska'),
    delayedPromise(707, 'Ewa Swoboda'),
    delayedPromise(728, 'Marika Popowicz')
]).then(function(winner) {
    console.log(winner, 'won');
});
```

### Chaining

The most underestimated feature of `Promises` is the ability to chain them.

Each call to `then` or `catch` actually returns a new `Promise` that is resolved after both the original `Promise` is resolved **and** the handler finishes running.

```
var fetchPromise = fetchDataFromBackend(...);
var fetchAndParsePromise = fetchPromise.then(function(rawData) {
    return JSON.parse(rawData);
});
fetchAndParsePromise.then(function(parsedData) {
    console.log('Data fetched and parsed', parsedData);
});
```

### Nesting

The chained handlers can also return a new `Promise` instance. In such situation the resulting `Promise` will wait with resolving itself until the new, nested `Promise` is resolved.

```
var fetchConfigurationPromise = fetchConfigurationFromBackend(...);
var fetchConfigurationAndDataPromise = fetchConfigurationPromise(configuration) {
    var fetchDataPromise = fetchData(configuration.key);
    return fetchDataPromise;
});
fetchConfigurationAndDataPromise.then(function(data) {
    console.log('Fetched data', data);
});
```

As we can see this gives us a powerful tool for dealing with `Promises` that depend on each other. We can elegantly build our code around this simple chaining API even for complex cases of asynchronous computations.

### Stacking

The handler can modify the outcome of the original `Promise`, even by 180 degrees. Using the chaining API we can turn a rejected `Promise` into a fulfilled one.

```
function fetchData() {
    return fetchDataFromBackend().catch(function(err) {
        return Promise.resolve(DUMMY_DATA);
    });
}
```

In this example we create a function that will either resolve with data from a backend endpoint or some dummy data, but will never fail (be rejected).

## The asynchronous riddle

Consider the following code:

```
(function() {
    console.log('start');
    setTimeout(function() {
        console.log('timeout');
    }, 0);
    console.log('middle');
    new Promise(function(resolve, reject) {
        console.log('promise constructor');
        resolve(7);
    }).then(function(n) {
        console.log('promise then', n);
    });
    console.log('end');
})();
```

What will be the order of messages printed to the console?

Anybody with a medium knowledge of JavaScript will figure out that in the beginning we will get:

```
start
middle
promise constructor
end
```

There will be no timeout, because we know that the callback passed to `setTimeout` is executed asynchronously. Earlier we mentioned, that `Promise` executor is run synchronously, so we get the `promise constructor` message before `end`. We know that `Promise` handlers are executed asynchronously, so we don't expect to see that message yet.

At this point we have 2 asynchronous tasks pending: the `setTimeout` callback and `Promise.then` handler. The surprising bit is the order in which those two will execute:

```
start
middle
promise constructor
end
promise then 7
timeout
```

The `Promise` handler run earlier than the `setTimeout` callback, even though the latter was scheduled earlier during the program execution.

### Microtasks

The reason for the strange order of execution lies within the specification of microtask handling by the JavaScript event loop.

Why are **microtasks** you ask?

The first question you need to ask though is: what are **tasks**?

**Tasks** are the asynchronous functions the browser needs to run and that we know and love, for example:

* firing a mouse click handler in response to user's action,
* parsing HTML,
* executing callback scheduled with `setTimeout`.

**Tasks** require the browser to switch context and are rather expensive.

**Microtasks** are tasks that are expected to fire much more often, including:

* mutation observer callbacks (`MutationObserver`)
* `Promise` handler callbacks

Since they are expected to run often, we want to minimize the expense of running them. And so the browser gets a special algorithm for handling microtasks.

### The event loop

## Alternatives

Native `Promise`s should work across most modern browsers excluding *Internet Explorer* and some old *Android* browsers. They should work on recent *Chrome*, *Firefox*, *Safari* and *Edge*. *node.js* also supports them.

There are libraries that implement the `Promise` concept or even extend it, including:

* **jQuery** - has it's own implementation of deferreds and promises, with more methods.
* **AngularJS** -has it's own implementation of `Promises` (named `$q`)
* **Q**
* **RSVP.js**
* **when**

## Summary

The `Promise` API is one of great simplicity. Despite that one can use it to build really complex use cases that will still be easy to read, understand and maintain. The chaining feature offers hidden power that can wage the final war against the classical JavaScript callback spaghetti. And win.

It's simple. It's smart. It's the future. Use it.
