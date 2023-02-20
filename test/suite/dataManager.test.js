const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const DataManager = require('../dataManager');

suite('Data Manager Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Local Storage', () => {
        // assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        const dataManager = new DataManager();
        assert.strictEqual(dataManager.get('test'), null);
    });
});
