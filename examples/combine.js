var promise = Promise.all([fetchNames(), fetchCities()]);
promise.then(function(args) {
    var names = args[0],
        cities = args[1];

    console.log('Names', names, 'Cities', cities);
});
promise.catch(function(error) {
    console.error('Failed', error);
});
