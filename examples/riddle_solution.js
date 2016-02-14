(function() {
    console.log('start');
    setTimeout(function() {
        console.log('timeout');
    }, 0);
    console.log('middle');
    Promise.resolve().then(function() {
        console.log('surprize');
    });
    console.log('end');
})();
