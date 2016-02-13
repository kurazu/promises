function fetchDataFromBackend(options) {
    var deferred = $.Deferred();
    setTimeout(function() {
        if (Math.random() < 0.5) {
            deferred.resolve('DATA');
        } else {
            deferred.reject(new Error('Bad luck!'));
        }
    }, 2000);
    return deferred.promise();
}

var promise = fetchDataFromBackend({});
promise.done(function(data) {
    console.log('Data fetched', data);
});
promise.fail(function(error) {
    console.log('Fetch failed', error);
});
