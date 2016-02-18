function sum(defer, iterations) {
    var iteration = 0, sum = 0;
    return new Promise(function(resolve, reject) {
        function step() {
            if (iteration >= iterations) {
                resolve(sum);
            } else {
                for (var i = 0; i < Math.pow(10, 7); i++) {
                    sum += i;
                }
                iteration++;
                defer(step);
            }
        }
        defer(step);
    });
}
