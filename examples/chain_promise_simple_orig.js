function fetchCity() {
    var cities = ['Poznań', 'Wrocław', 'Piła', 'Łódź'];
    return new Promise(function(resolve, reject) {
        setTimeout(resolve.bind(null, cities[~~(Math.random() * cities.length)]), 1000);
    });
}

function fetchManager(city) {
    var mapping = {'Poznań': 'Michał', 'Wrocław': 'Łukasz', 'Piła': 'Patryk', 'Łódź': 'Wojtek'};
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            if (mapping.hasOwnProperty(city)) {
                resolve(mapping[city]);
            } else {
                reject(new Error('Unknown city'));
            }
        }, 2000);
    });
}

var promise = fetchCity().then(fetchManager).then(String.prototype.toUpperCase.call.bind(String.prototype.toUpperCase));
promise.then(function(result) {
    console.log(result);
});
promise.catch(function(err) {
    console.log(err);
});
