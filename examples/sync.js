function identity(x) {
    return x;
}

function p(callback, data) {
    return new Promise(function(resolve, reject) {
        console.log('before resolve', callback.name);
        setTimeout(console.log.bind(console, 'timeout', callback.name), 0);
        resolve(callback(data));
        console.log('after resolve', callback.name);
    });
}

var promise = p(identity, 'zupa grzybowa').then(p.bind(null, function uppercase(words) {
    return words.toUpperCase();
})).then(p.bind(null, function split(words) {
    return words.split(' ');
}));
console.log('after promise definition');
promise.then(function(result) {
    console.log('handler', result);
});
console.log('after attaching handler');
