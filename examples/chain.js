function fetchCities() {
    var cities = ['Poznań', 'Wrocław', 'Piła', 'Łódź'];
    return new Promise(function(resolve, reject) {
        setTimeout(resolve.bind(null, cities), 1000);
    });
}

function upperCase(array) {
    return array.map(function(elem) {
        return elem.toUpperCase();
    });
}

function pad(array) {
    var maxLength = 0;
    array.forEach(function(elem) {
        maxLength = Math.max(maxLength, elem.length);
    });
    return array.map(function(elem) {
        return elem + '*'.repeat(maxLength - elem.length);
    });
}
