"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
// const MODES = require('./modes').modes;
// import * as MODES from './src/types/modes';
const modes_1 = require("./types/modes");
const dataManager_1 = require("./data/dataManager");
// const ViewManager = require('./viewManager');
// const TreeDataProvider = require('./treeDataProvider');
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// const vscode = require('vscode');
let dataManager = null;
// let viewManager = null;
// let treeManager = null;
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
let mode = modes_1.default.working;
let modeIcon = workingIcon;
let pomodorosPerLongBreak = 4;
let timerSpan = null;
let remainingTime = null;
let playButton = null;
let pauseButton = null;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const pad = (n) => n < 10 ? '0' + n : n;
const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return `${pad(minutes)}:${pad(seconds)}`;
};
function getTimerSpan() {
    const workspace = vscode.workspace;
    if (mode === modes_1.default.working) {
        return dataManager.getPomodoroLenghtMilliseconds(vscode.workspace);
    }
    if (mode === modes_1.default.break) {
        return dataManager.getShortBreakLengthMilliseconds(vscode.workspace);
    }
    if (mode === modes_1.default.longBreak) {
        return dataManager.getLongBreakLengthMilliseconds(vscode.workspace);
    }
    throw (new Error('Invalid mode: ' + mode));
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
function getTomatoDisplayString() {
    const isCondensed = dataManager.getIsCondensed(vscode.workspace);
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
function showStatusDisplay() {
    if (!playButton) {
        playButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    }
    playButton.text = getStatusDisplayString();
    playButton.command = 'pomodoro-timer-vscode.playPomodoro';
    if (!timerRunning) {
        playButton.show();
    }
    if (!pauseButton) {
        pauseButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 2);
    }
    pauseButton.text = getStatusDisplayString();
    pauseButton.command = 'pomodoro-timer-vscode.pausePomodoro';
    if (timerRunning) {
        pauseButton.hide();
    }
}
function startExtension() {
    timerRunning = false;
    initializeTime();
    showStatusDisplay();
    pauseButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 2);
    // messageDisplay = vscode.window.createStatusBarItem(
    //     vscode.StatusBarAlignment.Left, 3
    // );
    // vscode.window.setStatusBarMessage('👈 Start earning tomatoes! |');
}
function changeMode() {
    if (mode === modes_1.default.working) {
        if (numTomatoes % pomodorosPerLongBreak === 0) {
            mode = modes_1.default.longBreak;
            modeIcon = longBreakIcon;
            timerSpan = getTimerSpan();
        }
        else {
            mode = modes_1.default.break;
            modeIcon = breakIcon;
        }
    }
    else {
        mode = modes_1.default.working;
        modeIcon = workingIcon;
    }
    remainingTime = timerSpan;
    elapsedTime = 0;
}
function advance() {
    const now = new Date().getTime();
    if (timerRunning) {
        const delta = (new Date().getTime() - lastTime);
        elapsedTime += delta;
        remainingTime = timerSpan - elapsedTime;
        if (remainingTime <= 0) {
            if (mode === modes_1.default.working) {
                numTomatoes += 1;
                vscode.window.showInformationMessage('You earned a 🍅! Now take a break.');
            }
            else {
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
    }
    else {
        playButton.text = getStatusDisplayString();
        pauseButton.text = '';
        pauseButton.hide();
        playButton.show();
    }
    lastTime = now;
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    dataManager = new dataManager_1.default(context.workspaceState);
    // numTomatoes = (dataManager as DATA_MANAGER).getNumTomatoes();
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "pomodoro-timer-vscode" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    // let disposable = vscode.commands.registerCommand('pomodoro-timer-vscode.helloWorld', () => {
    //     // The code you place here will be executed every time your command is executed
    //     // Display a message box to the user
    //     vscode.window.showInformationMessage('Hello World from pomodoro-timer-vscode!');
    // });
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
        //interval = this.setInterval(advance, 10);
        interval = setInterval(advance, 10);
    });
    // context.subscriptions.push(disposable);
    context.subscriptions.push(pausePom);
    context.subscriptions.push(playPom);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map