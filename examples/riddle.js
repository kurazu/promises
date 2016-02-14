(function() {
    console.log('start');
    setTimeout(function() {
        console.log('timeout');
    }, 0);
    console.log('middle');
    // WRAP ME console.log('surprize');
    console.log('end');
})();
