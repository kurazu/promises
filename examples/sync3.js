console.log('before');
setTimeout(console.log.bind(console, 'timeout before'), 0);
var promise = new Promise(function(resolve, reject) {
    setTimeout(console.log.bind(console, 'timeout A'), 0);
    console.log('A');
    resolve('A');
}).then(function(input) {
    setTimeout(console.log.bind(console, 'timeout B'), 0);
    console.log('B');
    new Promise(function(resolve, reject) {
        console.log('I');
        resolve('I');
    }).then(function(i) {
        console.log('I handler', i);
    });
    return input + 'B';
}).then(function(input) {
    setTimeout(console.log.bind(console, 'timeout C'), 0);
    console.log('C');
    return input + 'C';
});
console.log('after promise definition');
promise.then(function(result) {
    console.log('handler', result);
});
console.log('after handler attched');
