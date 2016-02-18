function delayedPromise(delay, value) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(value);
            console.log(value, 'finished');
        }, delay);
    });
}

Promise.race([
    delayedPromise(735, 'Anna Kiełbasińska'),
    delayedPromise(707, 'Ewa Swoboda'),
    delayedPromise(728, 'Marika Popowicz')
]).then(function(winner) {
    console.log(winner, 'won');
});
