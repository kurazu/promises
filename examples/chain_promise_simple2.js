var promise = fetchCity().then(fetchManager).then(
    Function.prototype.call.bind(String.prototype.toUpperCase)
);
promise.then(function(result) {
    console.log(result);
});
promise.catch(function(err) {
    console.log(err);
});
