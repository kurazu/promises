function deferByTimeout(callback) {
    setTimeout(callback, 0);
}

function deferByPromise(callback) {
    Promise.resolve().then(callback);
}
