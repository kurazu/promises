function fetchCity() {
    var cities = ['Poznań', 'Wrocław', 'Piła', 'Łódź'];
    return new Promise(function(resolve, reject) {
        var city = cities[~~(Math.random() * cities.length)];
        setTimeout(resolve.bind(null, city), 1000);
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
