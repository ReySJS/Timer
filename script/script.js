class Timer {
    constructor() {
        this.state = "paused";
        this.time = 0;
        this.timerInterval = 100;
        this.internalTimer = null;
    }

    setTime(_time, _operation) {
        if (this.state == "paused") {
            if (_operation == "+") {
                this.time += _time;
                if (this.time >= 86400000) { this.time -= 86400000; }
            }
            else {
                this.time -= _time;
                if (this.time < 0) { this.time += 86400000; }
            }
        }
    }

    setInterval(_timerInterval) {
        return this.timerInterval = _timerInterval;
    }

    getCurrentTime() {
        return this.formatTime(this.time);
    }

    formatTime(ms) {
        var hours = Math.floor(ms / 3600000);
        var minutes = Math.floor((ms - (hours * 3600000)) / 60000);
        var seconds = Math.floor((ms - (hours * 3600000) - (minutes * 60000)) / 1000);

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        if (this.state == "running" && hours == 0 && minutes == 0) {
            return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + seconds;
        } else if (this.state == "running" && hours == 0) {
            return '&nbsp;&nbsp;&nbsp;' + minutes + ':' + seconds;
        } else {
            return hours + ':' + minutes + ':' + seconds;
        }
    }

    update() {
        if (this.state == "running") {
            this.time -= this.timerInterval;
        }
        return this.formatTime(this.time);
    }

    start() {
        if (this.state == "paused" && this.time != 0) {
            this.state = "running";
        }
    }

    stop() {
        if (this.state == "running") {
            this.state = "paused";
        }
        clearInterval(this.internalTimer);
        this.internalTimer = null;
    }

    reset() {
        this.stop();
        this.time = 0;
        this.update();
    }

    callbackTimeout() {
        if (this.time == 0) {
            this.stop()
        }
        return "Time is Over"
    }

    callbackTimeInterval() {
        setInterval(() => {
            this.callbackTimeout();
        }, this.timerInterval);
    }
}

let timers = [];
let numberOfTimers = 1;

function addNewTimer() {
    document.getElementById('chronometer').innerHTML = "";


    for (let i = 0; i < numberOfTimers; i++) {
        timers[i] = new Timer();
        document.getElementById('chronometer').innerHTML += `
        <div class="timer_field">
            <div class="timer">
                <div class="screen">
                    <p class="display_characters display_characters_top" id="display_characters_top${i}">
                        <span onclick="settingTime(${3600000}, '+', timers[${i}], ${i})">&and;</span>
                        <span onclick="settingTime(${60000}, '+', timers[${i}], ${i})">&and;</span>
                        <span onclick="settingTime(${1000}, '+', timers[${i}], ${i})">&and;</span>
                    </p>
                    <p class="display_time"><span id="display${i}">00:00:00</span></p>
                    <p class="display_characters display_characters_bot" id="display_characters_bot${i}">
                        <span onclick="settingTime(${3600000}, '-', timers[${i}], ${i})">&or;</span>
                        <span onclick="settingTime(${60000}, '-', timers[${i}], ${i})">&or;</span>
                        <span onclick="settingTime(${1000}, '-', timers[${i}], ${i})">&or;</span>
                    </p>
                </div>
                <div class="commands">
                    <button onclick="startTimer(timers[${i}], ${i})">Start</button>
                    <button onclick="stopTimer(timers[${i}], ${i})">Stop</button>
                    <button onclick="resetTimer(timers[${i}], ${i})">Reset</button>
                </div>
            </div>
            <div class="logs">
                <button onclick="currentTime(timers[${i}], ${i})">Get Current Time</button>
                <div class="current_time_logs" id="current_time_logs${i}"></div>
            </div>
        </div>`;
    }
    numberOfTimers++;
}


function settingTime(_time, _operation, _timer, _timerNumber) {
    _timer.setTime(_time, _operation);
    document.getElementById(`display${_timerNumber}`).innerHTML = _timer.getCurrentTime();
}

function increaseTimeInterval(_timeInterval, _timer, _timerNumber) {
    if (_timeInterval == 0) {
        document.getElementById(`current_time_logs${_timerNumber}`).innerHTML += `<p>Set Time Interval</p>`;
    } else {
        _timer.setInterval(_timeInterval);
        document.getElementById(`setted_interval${_timerNumber}`).innerHTML = `${_timeInterval}ms`;
    }
}

function currentTime(_timer, _timerNumber) {
    document.getElementById(`current_time_logs${_timerNumber}`).innerHTML += `<p>${_timer.getCurrentTime()}</p>`;
}


function startTimer(_timer, _timerNumber) {
    _timer.start();
    if (_timer.state == "running") {
        if (!_timer.internalTimer) {
            _timer.internalTimer = setInterval(function () {
                document.getElementById(`display${_timerNumber}`).innerHTML = _timer.update();
            }, _timer.callbackTimeInterval());
        }

        document.getElementById(`display_characters_top${_timerNumber}`).style.visibility = "hidden";
        document.getElementById(`display_characters_bot${_timerNumber}`).style.visibility = "hidden";

    }
}

function stopTimer(_timer, _timerNumber) {
    _timer.stop();
    if (_timer.internalTimer) {
        clearInterval(_timer.internalTimer);
    }
    document.getElementById(`display${_timerNumber}`).innerHTML = _timer.update();
    document.getElementById(`display_characters_top${_timerNumber}`).style.visibility = "visible";
    document.getElementById(`display_characters_bot${_timerNumber}`).style.visibility = "visible";
}

function resetTimer(_timer, _timerNumber) {
    _timer.reset();
    _timer.internalTimer = null;
    document.getElementById(`display${_timerNumber}`).innerHTML = _timer.update();
    document.getElementById(`current_time_logs${_timerNumber}`).innerHTML = ``;
    document.getElementById('display_characters_top').style.visibility = "visible";
    document.getElementById('display_characters_bot').style.visibility = "visible";
}