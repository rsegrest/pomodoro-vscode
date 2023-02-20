const MODES = require('./mode').MODES;
const DataManager = require('./dataManager');
const ViewManager = require('./viewManager');
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

let dataManager = null;
let viewManager = null;
let interval = null;

let numTomatoes = 0;
let elapsedTime = 0;
let lastTime = new Date().getTime();
let timerSpan = null;
let timerRunning = true;
let remainingTime = null;

let mode = MODES.working;
let playButton = null;
let pauseButton = null;
const playButtonIcon = '▶️';
const pauseButtonIcon = '⏸';
const workingIcon = '🛠️';
const breakIcon = '☕';
const longBreakIcon = '🍔';
let modeIcon = workingIcon;
let pomodorosPerLongBreak = 4;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
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
        } else {
            mode = MODES.break;
            modeIcon = breakIcon;
        }
    } else {
        mode = MODES.working;
        modeIcon = workingIcon;
    }
}
function getTomatoDisplayString() {
    const isCondensed = dataManager.getIsCondensed(vscode);

    if (isCondensed) {
        return numTomatoes + ' 🍅';
    }
    let tomatoes = '';
    for (let i = 0; i < numTomatoes; i++) {
        tomatoes += '🍅';
    }
    return tomatoes;
}
function advance() {

    const now = new Date().getTime();
    if (timerRunning) {
        console.log('timerRunning')
        const delta = (new Date().getTime() - lastTime);
        elapsedTime += delta;
        remainingTime = timerSpan - elapsedTime;
        const tomatoes = getTomatoDisplayString();
        const timerString = formatTime(remainingTime);
        vscode.window.setStatusBarMessage(tomatoes + ' | ' + modeIcon + ' | ' + timerString);

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

    playButton.text = playButtonIcon;
    playButton.command = 'pomodoro-timer-vscode.playPomodoro';
    if (!timerRunning) {
        playButton.show();
    }

    if (!pauseButton) {
        pauseButton = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left, 2
        );
    }

    pauseButton.text = pauseButtonIcon;
    pauseButton.command = 'pomodoro-timer-vscode.pausePomodoro';
    if (timerRunning) {
        pauseButton.hide();
    }
}
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    dataManager = new DataManager(context.workspaceState);
    viewManager = new ViewManager(); // context
    dataManager.clearAllEarnedTomatoes();
    // numTomatoes = 0;
    numTomatoes = dataManager.getTodaysTomatoes();
    pomodorosPerLongBreak = dataManager.getPomodorosPerLongBreak(vscode);
    timerRunning = false;


    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('"pomodoro-timer" is now active');
    // initializeTime();
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let pomReady = vscode.commands.registerCommand('pomodoro-timer-vscode.pomodoroReady', function () {
        initializeTime();
        showStatusDisplay();
        vscode.window.showInformationMessage('🍅 timer ready! Hit play to start working');
    });
    // let startPom = vscode.commands.registerCommand('pomodoro-timer-vscode.startPomodoro', function () {
    //     vscode.window.showInformationMessage('🍅 timer ready!');
    //     initializeTime();
    // });
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
        // vscode.window.setStatusBarMessage(remainingTime);
        vscode.window.setStatusBarMessage('🍅' + ' | ' + modeIcon + ' | ' + formatTime(remainingTime));
    });


    context.subscriptions.push(pomReady);
    context.subscriptions.push(pausePom);
    context.subscriptions.push(playPom);

}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
}
