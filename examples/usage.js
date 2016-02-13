var promise;

promise = fetchDataFromBackend({
    url: '/endpoint',
    data: 'SOME DATA',
    method: 'POST'
});
promise.then(function(data) {
    console.log('Data fetched', data);
});
promise.catch(function(error) {
    console.log('Fetch failed', error);
});
