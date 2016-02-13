var promise = fetchCities().then(matchManagers).then(upperCase);
promise.then(function(result) {
    console.log(result);
});
promise.catch(function(err) {
    console.log(err);
});
