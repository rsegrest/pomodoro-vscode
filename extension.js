const MODES = require('./mode').MODES;
const DataManager = require('./dataManager');
const ViewManager = require('./viewManager');
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

let dataManager = null;
let viewManager = null;
let interval = null;

const playButtonIcon = '| ▶️';
const pauseButtonIcon = '| ⏸';
const workingIcon = '🛠️';
const breakIcon = '☕';
const longBreakIcon = '🍔';

let numTomatoes = 0;
let elapsedTime = 0;
let lastTime = new Date().getTime();
let timerRunning = true;

let mode = MODES.working;
let modeIcon = workingIcon;
let pomodorosPerLongBreak = 4;

let timerSpan = null;
let remainingTime = null;
let playButton = null;
let pauseButton = null;


const pad = (n) => {
    return (n < 10) ? ("0" + n) : n;
}
function formatTime(time) {
    return Math.floor(time/60000) + ':' + pad(Math.floor((time%60000)/1000));
}
function changeMode() {
    if (mode === MODES.working) {
        if (numTomatoes % pomodorosPerLongBreak === 0) {
            mode = MODES.longBreak;
            modeIcon = longBreakIcon;
            timerSpan = getTimerSpan();
        } else {
            mode = MODES.break;
            modeIcon = breakIcon;
        }
    } else {
        mode = MODES.working;
        modeIcon = workingIcon;
    }
    remainingTime = timerSpan;
    elapsedTime = 0;
}
function getTomatoDisplayString() {
    const isCondensed = dataManager.getIsCondensed(vscode);

    if (isCondensed) {
        return numTomatoes + ' 🍅';
    }
    if (numTomatoes === 0) {
        return 'None yet!';
    }
    let tomatoes = '';
    for (let i = 0; i < numTomatoes; i++) {
        tomatoes += '🍅';
    }
    return tomatoes;
}
function getStatusDisplayString() {
    const tomatoes = getTomatoDisplayString();
    if (timerRunning) {
        return pauseButtonIcon + ' | ' + tomatoes + ' | ' + modeIcon + ' | ' + formatTime(remainingTime) + ' |';
    }
    return playButtonIcon + ' | ' + tomatoes + ' | ' + modeIcon + ' | ' + formatTime(remainingTime) + ' |';
}
function advance() {

    const now = new Date().getTime();
    if (timerRunning) {
        const delta = (new Date().getTime() - lastTime);
        elapsedTime += delta;
        remainingTime = timerSpan - elapsedTime;
        if (remainingTime <= 0) {
            if (mode === MODES.working) {
                numTomatoes += 1;
                vscode.window.showInformationMessage('You earned a 🍅! Now take a break.');
            } else {
                vscode.window.showInformationMessage('Back to work!');
            }
            changeMode();
            initializeTime();
            timerRunning = false;
        }
        playButton.text = '';
        pauseButton.text = getStatusDisplayString();
        playButton.hide();
        pauseButton.show();
    } else {
        playButton.text = getStatusDisplayString();
        pauseButton.text = '';
        pauseButton.hide();
        playButton.show();
    }

    lastTime = now;
}


function getTimerSpan() {
    if (mode === MODES.working) {
        return dataManager.getPomodoroLenghtMilliseconds(vscode);
    }
    if (mode === MODES.break) {
        return dataManager.getShortBreakLengthMilliseconds(vscode);
    }
    if (mode === MODES.longBreak) {
        return dataManager.getLongBreakLengthMilliseconds(vscode);
    }
    throw(new Error('Invalid mode: ' + mode));
}


function initializeTime() {
    lastTime = new Date().getTime();
    timerSpan = getTimerSpan();
    remainingTime = timerSpan;
    elapsedTime = 0;
    timerRunning = false;
}


function playTimer() {
    timerRunning = true;
}


function pauseTimer() {
    timerRunning = false;
}


function showStatusDisplay() {

    if (!playButton) {
        playButton = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left, 1
        );
    }

    playButton.text = getStatusDisplayString();
    playButton.command = 'pomodoro-timer-vscode.playPomodoro';
    if (!timerRunning) {
        playButton.show();
    }

    if (!pauseButton) {
        pauseButton = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left, 2
        );
    }

    pauseButton.text =  getStatusDisplayString();
    pauseButton.command = 'pomodoro-timer-vscode.pausePomodoro';
    if (timerRunning) {
        pauseButton.hide();
    }
}


function startExtension() {
    timerRunning = false;
    initializeTime();
    showStatusDisplay();
    pauseButton = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left, 2
    );
    // messageDisplay = vscode.window.createStatusBarItem(
    //     vscode.StatusBarAlignment.Left, 3
    // );
    // vscode.window.setStatusBarMessage('👈 Start earning tomatoes! |');
}


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    dataManager = new DataManager(context.workspaceState);
    viewManager = new ViewManager(); // context
    numTomatoes = dataManager.getTodaysTomatoes();
    pomodorosPerLongBreak = dataManager.getPomodorosPerLongBreak(vscode);
    startExtension();

    console.log('"pomodoro-timer" is now active');
    vscode.window.showInformationMessage('🍅 timer ready! Hit play to start work session');
    let pausePom = vscode.commands.registerCommand('pomodoro-timer-vscode.pausePomodoro', function () {
        vscode.window.showInformationMessage('🍅 timer paused');
        pauseTimer();
        playButton.show();
        pauseButton.hide();
    });
    let playPom = vscode.commands.registerCommand('pomodoro-timer-vscode.playPomodoro', function () {
        showStatusDisplay();
        vscode.window.showInformationMessage('🍅 timer started');
        playTimer();
        playButton.hide();
        pauseButton.show();
        interval = this.setInterval(advance, 10);

    });


    // context.subscriptions.push(pomReady);
    context.subscriptions.push(pausePom);
    context.subscriptions.push(playPom);

}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
}
