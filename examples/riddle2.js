(function() {
    console.log('start');
    setTimeout(function() {
        console.log('timeout');
    }, 0);
    console.log('middle');
    new Promise(function(resolve, reject) {
        console.log('promise constructor');
        resolve(7);
    }).then(function(n) {
        console.log('promise then', n);
    });
    console.log('end');
})();
