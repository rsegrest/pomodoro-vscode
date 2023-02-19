// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

let numTomatoes = 5;
let elapsedTime = 0;
let lastTime = new Date().getTime();
let timerSpan = 25*60*10;
let timerRunning = true;
let remainingTime = timerSpan;
// let timerDisplayString = '0:00';

let testCounter = 0;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

function formatTime(time) {
    return Math.floor(time/60000) + ':' + Math.floor((time%60000)/1000);
}

function advance() {
    // console.log(testCounter++)
    // if (timerRunning) {
        const now = new Date().getTime();
        const delta = (new Date().getTime() - lastTime);
        elapsedTime += delta;
        lastTime = now;
        remainingTime = timerSpan - elapsedTime;
        
        let tomatoes = '';
        for (let i = 0; i < numTomatoes; i++) {
            tomatoes += '🍅';
        }
        const timerString = formatTime(remainingTime);

        // vscode.window.setStatusBarMessage('TOMATO-2');
        vscode.window.setStatusBarMessage(tomatoes + ' | ' + timerString);
        // vscode.window.setStatusBarMessage(timerDisplayString);

        if (remainingTime <= 0) {
            vscode.window.showInformationMessage('Earned a 🍅!');
            // console.log('Earned a 🍅!')
            initialize();
            timerRunning = false;
            numTomatoes += 1;
        }
    // }
}
function initialize() {
    timerSpan = 25*60*10;
    // timerSpan = 25*60;
    lastTime = new Date().getTime();
    remainingTime = timerSpan;
    elapsedTime = 0;
    timerRunning = false;
}
function startTimer() {
    timerRunning = true;
}
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hello-world-js" is now active!');


    // helloPomodoro",
    //         "title": "Hello Pomodoro"
    //     },
    //     {
    //         "command": "pomodoro-timer-vscode.startPomodoro",
    //         "title": "Start Pomodoro"
    //     },
    //     {
    //         "command": "pomodoro-timer-vscode.pausePomodoro",
    //         "title": "Pause Pomodoro"
    //     },
    //     {
    //         "command": "pomodoro-timer-vscode.playPomodoro",
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let helloPom = vscode.commands.registerCommand('pomodoro-timer-vscode.helloPomodoro', function () {
		// The code you place here will be executed every time your command is executed
        initialize();
        startTimer();
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
	});
    let playPom = vscode.commands.registerCommand('pomodoro-timer-vscode.playPomodoro', function () {
		vscode.window.showInformationMessage('Play 🍅!');
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
