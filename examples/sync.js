var promise = new Promise(function(resolve, reject) {
    console.log('promise executor');
    resolve('zupa grzybowa');
}).then(function(words) {
    console.log('uppercase');
    return words.toUpperCase();
}).then(function(words) {
    console.log('split');
    return words.split(' ');
});
console.log('after promise definition');
promise.then(function(result) {
    console.log('handler', result);
});
console.log('after attaching handler');
