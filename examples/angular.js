function fetchDataFromBackend(options) {
    return $q(function(resolve, reject) {
        setTimeout(function() {
            if (Math.random() < 0.5) {
                resolve('DATA');
            } else {
                reject(new Error('Bad luck!'));
            }
        }, 2000);
    });
}

var promise = fetchDataFromBackend({});
promise.then(function(data) {
    console.log('Data fetched', data);
});
promise.catch(function(error) {
    console.log('Fetch failed', error);
});
