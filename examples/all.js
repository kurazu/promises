Promise.all([
    Promise.resolve(3),
    Promise.resolve(4)
]).then(function(args) {
    console.log(args[0], args[1]);
}).catch(function(err) {
    console.error('☹', err);
});
