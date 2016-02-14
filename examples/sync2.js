function countToMilion() {
    for (i =0; i < Math.pow(10, 9); i++) { /* do nothing */ }
}

console.log('before');
setTimeout(console.log.bind(console, 'timeout before'), 0);
var promise = new Promise(function(resolve, reject) {
    setTimeout(console.log.bind(console, 'timeout A'), 0);
    countToMilion();
    console.log('A');
    resolve('A');
    countToMilion();
}).then(function(input) {
    setTimeout(console.log.bind(console, 'timeout B'), 0);
    countToMilion();
    console.log('B');
    return input + 'B';
}).then(function(input) {
    setTimeout(console.log.bind(console, 'timeout C'), 0);
    countToMilion();
    console.log('C');
    return input + 'C';
});
console.log('after promise definition');
promise.then(function(result) {
    console.log('handler', result);
});
console.log('after handler attched');
