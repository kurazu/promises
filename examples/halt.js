window.addEventListener('load', function() {
    var functions = {};

    functions.tsum = function(max) {
        var number = 1,
            sum = 0;

        return new Promise(function(resolve, reject) {
            function step() {
                if (number > max) {
                    resolve(sum);
                } else {
                    sum += number++;
                    setTimeout(step, 0);
                }
            }
            setTimeout(step, 0);
        });
    };

    functions.psum = function(max) {

    };

    Array.prototype.forEach.call(document.querySelectorAll('.spinner'), function(spinner) {
        var funcName = spinner.getAttribute('data-func'),
            func = functions[funcName];

        spinner.addEventListener('click', calculate.bind(null, spinner, func), false);

    });

    function calculate(spinner, promiseProducer) {
        var promise,
            ts;
        spinner.classList.add('working');

        ts = +new Date;
        promise = promiseProducer(Math.pow(10, 4));
        promise.then(function(result) {
            var elapsed;

            elapsed = (+new Date) - ts;
            spinner.classList.remove('working');
            spinner.classList.add('done');
            spinner.innerText = result + ' in ' + (elapsed / 1000) + 's';
        });

    }

}, false);
