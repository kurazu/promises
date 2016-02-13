function fetchManager(city) {
    var mapping = {'Poznań': 'Michał', 'Wrocław': 'Łukasz', 'Piła': 'Patryk', 'Łódź': 'Wojtek'};
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            if (mapping.hasOwnProperty(city)) {
                resolve(mapping[city]);
            } else {
                reject(new Error('Unknown city'));
            }
        }, Math.random() * 10000);
    });
}

function matchManagers(cities) {
    return Promise.all(cities.map(function(city) {
        return fetchManager(city);
    }));
}
