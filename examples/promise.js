function fetchDataFromBackend(options) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            if (Math.random() < 0.5) {
                resolve('DATA');
            } else {
                reject(new Error('Bad luck!'));
            }
        }, 2000);
    });
}
