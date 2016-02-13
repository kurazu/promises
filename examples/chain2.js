var promise = fetchCities().then(upperCase).then(pad);
promise.then(function(result) {
    console.log(result);
});
promise.catch(function(err) {
    console.log(err);
});
