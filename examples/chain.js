function fetchCities() {
    return new Promise(function(resolve, reject) {
        setTimeout(resolve.bind(null, ['Poznań', 'Wrocław', 'Piła', 'Łódź']));
    });
}

function lowerCase(array) {
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

var promise = fetchCities().then(lowerCase).then(pad);
promise.then(function(result) {
    console.log(result);
});
promise.catch(function(err) {
    console.log(err);
});
