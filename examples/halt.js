window.addEventListener('included', function() {
    var functions = {};

    functions.timeout = function(callback) {
        setTimeout(callback, 0);
    };

    functions.promise = function(callback) {
        Promise.resolve().then(callback);
    };

    function sum(defer, iterations) {
        var iteration = 0,
            sum = 0;

        return new Promise(function(resolve, reject) {
            function step() {
                var i;
                if (iteration >= iterations) {
                    resolve(sum);
                } else {
                    for (i = 0; i < Math.pow(10, 7); i++) {
                        sum += i;
                    }
                    iteration++;
                    defer(step);
                }
            }
            defer(step);
        });
    };

    Array.prototype.forEach.call(document.querySelectorAll('.spinner'), function(spinner) {
        var funcName = spinner.getAttribute('data-func'),
            func = functions[funcName];

        spinner.addEventListener('click', calculate.bind(null, spinner, func), false);

    });

    function calculate(spinner, deferFunc) {
        var promise,
            ts;
        spinner.classList.add('working');

        ts = +new Date;
        promise = sum(deferFunc, 100);
        promise.then(function(result) {
            var elapsed;

            elapsed = (+new Date) - ts;
            spinner.classList.remove('working');
            spinner.classList.add('done');
            spinner.innerText = (elapsed / 1000).toFixed(1) + 's';
        });

    }

}, false);
