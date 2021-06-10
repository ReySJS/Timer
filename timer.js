class Timer {

    constructor() {
        this.time = 0;
        this.currentTime = 0;
        this.timerInterval = 100;
        this.callbackTimeout = function() {};
        this.callbackTimeInterval = function() {};
    }
    setTime(_time) {
        this.time = _time;
    }
    setTimerInterval(_timerInterval = 100) {
        this.timerInterval = _timerInterval;
    }
    setCallbackTimeout(_callbackTimeout) {
        this.callbackTimeout = _callbackTimeout;
    }
    setCallbackTimeInterval(_callbackTimeInterval) {
        this.callbackTimeInterval = _callbackTimeInterval;
    }
    timeCount() {
        this.time -= this.timerInterval;
        this.currentTime += this.timerInterval
        if (this.time <= 0) {
            clearInterval(this.internalTimer);
            clearInterval(this.internalTimeRemaining);
        }
    }
    getTime() {
    return this.time
    }
    getCurrentTime() {
        return this.currentTime;
    }
    getCurrentTimeString() {
    let time = this.time
   	let hours = Math.floor(time / 3600000);
    let minutes = Math.floor((time - (hours * 3600000)) / 60000);
    let seconds = Math.floor((time - (hours * 3600000) - (minutes * 60000)) / 1000);
    let ms = Math.floor((time - (hours * 3600000) - (minutes * 60000) - (seconds * 1000)) / 100);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ":" + minutes + ":" + seconds + "." + ms;
  }
    startTimer() { 
    		this.time -= this.currentTime;
        this.internalTimeRemaining = setInterval(() => { this.timeCount() }, this.timerInterval);
        this.internalTimeout = setTimeout(this.callbackTimeout, this.time);
        this.internalTimer = setInterval(this.callbackTimeInterval, this.timerInterval);
       
    }
    stopTimer() {
        clearTimeout(this.internalTimeout);
        clearInterval(this.internalTimer);
        clearInterval(this.internalTimeRemaining);
    }
    resetTimer() {
        this.stopTimer();
        this.time = 0;
        this.currentTime = 0;
        this.timerInterval = 100;
        this.callbackTimeout = "";
        this.callbackTimeInterval = "";
    }
}

let conjuntoClocks = []
let stopWatchs = -1


// ----------- Audios ---------------//
const music = new Audio();
const overMusic = "https://assets.mixkit.co/sfx/preview/mixkit-arcade-retro-game-over-213.mp3"
const playMusic = "https://assets.mixkit.co/sfx/preview/mixkit-game-show-suspense-waiting-667.mp3"
const pauseMusic = "https://assets.mixkit.co/sfx/preview/mixkit-fast-small-sweep-transition-166.mp3"

function sound(_music) {
  music.src = _music;
  music.play();
}
//--------------------------------------------------

// -----------------------  start function ----------------------------- 

function startCounting(_identifyStopwatch) {

  const timeInterval = () => {
    console.log("Time Remaining " + conjuntoClocks[_identifyStopwatch].getTime());  
    console.log("Current Timer " + conjuntoClocks[_identifyStopwatch].getCurrentTime());
    document.getElementById(`texto-${_identifyStopwatch}`).innerHTML = conjuntoClocks[_identifyStopwatch].getCurrentTimeString();
  }

  const timeOut = () => {
    conjuntoClocks[_identifyStopwatch].stopTimer();
    sound(overMusic);
    document.getElementById(`texto-${_identifyStopwatch}`).innerHTML = "Game Over";
    document.getElementById(`btn-start-${_identifyStopwatch}`).disabled = false;
  }

  const hour = document.getElementById(`hours-${_identifyStopwatch}`).value * 3600000;
  const minute = document.getElementById(`minutes-${_identifyStopwatch}`).value * 60000;
  const second = document.getElementById(`seconds-${_identifyStopwatch}`).value * 1000;
  const milliseconds = (document.getElementById(`milliseconds-${_identifyStopwatch}`).value * 10) || 0;
  
  document.getElementById(`btn-start-${_identifyStopwatch}`).disabled = true;

  conjuntoClocks[_identifyStopwatch].setTime(hour + minute + second + milliseconds);
  conjuntoClocks[_identifyStopwatch].setCallbackTimeInterval(timeInterval);
  conjuntoClocks[_identifyStopwatch].setCallbackTimeout(timeOut);
  conjuntoClocks[_identifyStopwatch].startTimer();
  sound(playMusic)
}
// ---------------------------------------------------------------------

// -----------------------  reset function ----------------------------- 
function resetCounting(_identifyStopwatch) {
  conjuntoClocks[_identifyStopwatch].resetTimer();
  document.getElementById(`texto-${_identifyStopwatch}`).innerHTML = conjuntoClocks[_identifyStopwatch].resetTimer();
  document.getElementById(`btn-start-${_identifyStopwatch}`).disabled = false;
  sound(pauseMusic);
}

// ---------------------------------------------------------------------

// -----------------------  stop function ----------------------------- 

function stopCounting(_identifyStopwatch) {
  conjuntoClocks[_identifyStopwatch].stopTimer();
  document.getElementById(`texto-${_identifyStopwatch}`).innerHTML = conjuntoClocks[_identifyStopwatch].getCurrentTimeString();
  console.log(conjuntoClocks[_identifyStopwatch].getCurrentTime());
  document.getElementById(`btn-start-${_identifyStopwatch}`).disabled = false;
  sound(pauseMusic)
}
// ---------------------------------------------------------------------

// -----------------------  add function ----------------------------- 
function addStopWatch() {
  stopWatchs++;
  conjuntoClocks.push(new Timer());
  let elemento = document.createElement("div");
  elemento.innerHTML = `

  <div id="contador${stopWatchs}">
    <p id="texto-${stopWatchs}"></p>
  </div>

  <button type="button" id="offButton-${stopWatchs}" onclick="resetCounting(${stopWatchs})">
    off
  </button>
  <button type="button" id="stopButton-${stopWatchs}" onclick="stopCounting(${stopWatchs})">
    stop
  </button>
  <button type='submit' id="btn-start-${stopWatchs}" onclick="startCounting(${stopWatchs})">
    start
  </button>
  <br />
  <input id="hours-${stopWatchs}" type="numbers">
  <input id="minutes-${stopWatchs}" type="numbers">
  <input id="seconds-${stopWatchs}" type="numbers">
  <input id="milliseconds-${stopWatchs}" type="numbers">
`
  document.getElementById("corpos").appendChild(elemento);
}
addStopWatch()