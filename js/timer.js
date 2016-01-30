(function(exports) {

    function Timer(parentElement) {
        this.element = this.createElement(parentElement);
        this.update();
    }

    Timer.prototype.createElement = function(parentElement) {
        var element = document.createElement('small');
        element.className = 'timer';
        parentElement.appendChild(element);
        return element;
    };

    Timer.prototype.update = function() {
        this.element.innerText = this.formatTime();
        this.schedule();
    };

    Timer.prototype.formatTime = function() {
        var time;

        time = (new Date()).toString().split(' ')[4];
        return time.slice(0, 5);
    }

    Timer.prototype.schedule = function() {
        setTimeout(this.update.bind(this), 1000);
    };

    exports.timer = {
        Timer: Timer
    };
})(this);
