const MODES = require('./mode').MODES;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

let numTomatoes = 0;
let elapsedTime = 0;
let lastTime = new Date().getTime();
let timerSpan = 25*60*10;
let timerRunning = true;
let remainingTime = timerSpan;
// let testCounter = 0;
// let timerDisplayString = '0:00';

let mode = MODES.working;
let playButton = null;
let pauseButton = null;
const playButtonIcon = '▶️';
const pauseButtonIcon = '⏸';
const workingIcon = '🛠️';
const breakIcon = '☕';
const longBreakIcon = '🍔';
let modeIcon = workingIcon;

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
        if (numTomatoes % 4 === 0) {
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
    console.log('MODE IS NOW: ' + mode);
}
function getTomatoDisplayString() {
    const isCondensed = vscode.workspace.getConfiguration('pomodoro-timer-vscode').get('condensedDisplay');

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
            initialize();
            timerRunning = false;
        }
    }
    lastTime = now;
}
function getTimerSpan() {
    if (mode === MODES.working) {
        return 25*60*10;
    }
    if (mode === MODES.break) {
        return 5*60*10;
    }
    if (mode === MODES.longBreak) {
        return 15*60*10;
    }
    return 10000;
}
function initialize() {
    // timerSpan = 25*60*10;
    // timerSpan = 25*60;
    lastTime = new Date().getTime();
    remainingTime = getTimerSpan();
    console.log(`remainingTime: ${remainingTime}`);
    elapsedTime = 0;
    timerRunning = false;
}
function playTimer() {
    timerRunning = true;
}
function pauseTimer() {
    timerRunning = false;
}
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    timerRunning = false;
    playButton = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left, 1
    );

    playButton.text = playButtonIcon;
    playButton.command = 'pomodoro-timer-vscode.playPomodoro';
    playButton.show();

    pauseButton = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left, 2
    );

    pauseButton.text = pauseButtonIcon;
    pauseButton.command = 'pomodoro-timer-vscode.pausePomodoro';
    pauseButton.hide();

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "hello-world-js" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let helloPom = vscode.commands.registerCommand('pomodoro-timer-vscode.helloPomodoro', function () {
        // The code you place here will be executed every time your command is executed
        initialize();
        playTimer();
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello 🍅!');
        // vscode.window.showWarningMessage('Danger Will Robinson! Danger!')
        // create input box
        // let inputBox = vscode.window.setStatusBarMessage('🍅');
        // inputBox.title = "Enter your name";

        // let msg = '';
        // for (let i = 0; i < numTomatoes; i++) {
        //     msg += '🍅';
        // }
        // vscode.window.setStatusBarMessage('TOMATO');
    });
    let startPom = vscode.commands.registerCommand('pomodoro-timer-vscode.startPomodoro', function () {
        vscode.window.showInformationMessage('Start 🍅!');
        initialize();
    });
    let pausePom = vscode.commands.registerCommand('pomodoro-timer-vscode.pausePomodoro', function () {
        vscode.window.showInformationMessage('Pause 🍅!');
        pauseTimer();
        // playButton = null;
        // playButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        // playButton.text = playButtonIcon;
        // playButton.command = 'pomodoro-timer-vscode.playPomodoro';
        playButton.show();
        pauseButton.hide();
    });
    let playPom = vscode.commands.registerCommand('pomodoro-timer-vscode.playPomodoro', function () {
        vscode.window.showInformationMessage('Play 🍅!');
        playTimer();
        // playButton = null;
        // playButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        // playButton.text = pauseButtonIcon;
        // playButton.command = 'pomodoro-timer-vscode.pausePomodoro';
        playButton.hide();
        pauseButton.show();
    });
    let resetPom = vscode.commands.registerCommand('pomodoro-timer-vscode.resetPomodoro', function () {
        numTomatoes = 0;
    });

    this.setInterval(advance, 10);
    vscode.window.setStatusBarMessage(remainingTime);

	context.subscriptions.push(helloPom);
    context.subscriptions.push(startPom);
    context.subscriptions.push(pausePom);
    context.subscriptions.push(playPom);

}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
